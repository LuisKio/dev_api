const models = require('../database/models');
const { CustomError } = require('../utils/helpers');

class ApplicationsService {
  constructor() { }

  async getApplicationOr404raw(id) {
    let application = await models.Applications.findByPk(id, {raw: true});
    if (!application) throw new CustomError('Not Found Application', 404, 'Not Found');
    return application;
  }


  async getApplication(id) {
    let application = await models.Applications.findByPk(id, {raw: true});
    if (!application) throw new CustomError('Not Found Application', 404, 'Not Found');
    return application;
  }

  async createApplication(data) {
    const transaction = await models.sequelize.transaction();
    try {
      let newApplication = await models.Applications.create(
        data, 
        {
          transaction, 
          fields: [
            'user_id',
            'legal_first_names',
            'legal_last_names',
            'nationality',
            'email',
            'phone',
            'date_of_birth',
            'gender',
            'passport_number',
            'passport_expiration_date',
            'residence',
            'residence_address',
            'job',
            'comments',
            'status'
          ]
        }
      );

      await transaction.commit();
      return newApplication;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async getStatusAppliction(id){
    let {status} = await models.Applications.scope('view_status').findByPk(id);
    if(!status) throw new CustomError('Not found Appplication', 404, 'Not Found')
    if(status === 'confirmed') throw new CustomError('Not found user', 403, 'Not Found');
    return status;
  }

  async updateApplication(id, data){
    const transaction = await models.sequelize.transaction();
    try {
      let updateApplication = await models.Applications.update(data, {
        where: {
          user_id: id
        }
      }, {
        transaction,
        fields: [
          'legal_first_names',
          'legal_last_names',
          'nationality',
          'email',
          'phone',
          'date_of_birth',
          'gender',
          'passport_number',
          'passport_expiration_date',
          'residence',
          'residence_address',
          'job',
          'comments',
          'status'
        ]
      });
      await transaction.commit();

      return updateApplication;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async addPaymentInfo(user_id, payment_intent) {
    const transaction = await models.sequelize.transaction()
    try {
      let application = await models.Applications.findByPk(user_id)

      if (!application) throw new CustomError('Not found Application', 404, 'Not Found')

      await application.createPayment({application_id:user_id, payment_intent:payment_intent},{ transaction })

      await transaction.commit()

      return application
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  
}
}

module.exports = ApplicationsService;