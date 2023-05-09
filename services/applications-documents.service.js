const models = require('../database/models')
const { CustomError } = require('../utils/helpers');


class ApplicationDocumentsService {
  constructor () {}

  async getAvailableDocumentsOrders(application_id) {
    
    let availableValues = [1,2,3]
    
    let documents = await models.ApplicationsDocuments.findAll({
      attributes: {exclude:['created_at','updated_at']},
      where: {application_id}, 
      raw: true
    })

    if (!documents) return availableValues
    if (documents.length == 0) return availableValues
    if (documents.length >= availableValues.length) throw new CustomError('Not available spots for documents for this publication. First, remove a document',409, 'No Spots Available')

    let existedOrders = documents.map( (document) =>  document['order'])
    
    let availableSpots = availableValues.filter(spot => !existedOrders.includes(spot))
    
    return availableSpots
  }

  async createDocument(application_id,url,order) {
    const transaction = await models.sequelize.transaction()
    
    try {  
      let newDocument = await models.ApplicationsDocuments.create({ application_id, url, order }, { transaction })
      await transaction.commit();
      return newDocument
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  }

  async getDocumentOr404(application_id, order) {
    const applicationDocument = await models.ApplicationsDocuments.findOne({ where: { application_id, order: parseInt(order) }});
    if (!applicationDocument) throw new CustomError('Not Found Application Document with this order', 404, 'Not Found');
    return applicationDocument
  }

  async removeDocument(application_id, order) {
    const transaction = await models.sequelize.transaction()
    try {
      let application = await models.ApplicationsDocuments.findOne({
        where: { application_id, order: parseInt(order) },
      }, { transaction });

      await application.destroy({transaction})
      await transaction.commit();

      return application
    } catch (error) {
      await transaction.rollback();
      throw error
    }
  }

}

module.exports = ApplicationDocumentsService