const models = require('../database/models');
const { CustomError } = require('../utils/helpers');

class ApplicationsService {
  constructor() { }

  async getApplication(id) {
    let application = await models.Applications.scope('get_application').findByPk(id, {raw: true});
    if (!application) throw new CustomError('Not Found Appliction', 404, 'Not Found');
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
    if(status === 'confirmed') throw new CustomError('Not found user', 404, 'Not Found');
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
}


module.exports = ApplicationsService;