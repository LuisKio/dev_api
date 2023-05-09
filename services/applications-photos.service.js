const models = require('../database/models')
const { CustomError } = require('../utils/helpers');


class ApplicationPhotosService {
  constructor () {}

  async getAvailablePhotosOrders(application_id) {
    
    let availableValues = [1,2,3]
    
    let images = await models.ApplicationsPhotos.findAll({
      attributes: {exclude:['created_at','updated_at']},
      where: {application_id}, 
      raw: true
    })

    if (!images) return availableValues
    if (images.length == 0) return availableValues
    if (images.length >= availableValues.length) throw new CustomError('Not available spots for images for this publication. First, remove a image',409, 'No Spots Available')

    
    let existedOrders = images.map( (image) =>  image['order'])
    
    let availableSpots = availableValues.filter(spot => !existedOrders.includes(spot))
    
    return availableSpots
  }

  async createPhoto(application_id,url,order) {
    const transaction = await models.sequelize.transaction()
    
    try {  
      let newImage = await models.ApplicationsPhotos.create({ application_id, url, order }, { transaction })
      await transaction.commit();
      return newImage
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  }
  async getPhotoOr404(application_id, order) {
    const applicationImage = await models.ApplicationsPhotos.findOne({ where: { application_id, order: parseInt(order) }});
    if (!applicationImage) throw new CustomError('Not Found Application Image with this order', 404, 'Not Found');
    return applicationImage

  }

  async removePhoto(application_id, order) {
    const transaction = await models.sequelize.transaction()
    try {

      let application = await models.ApplicationsPhotos.findOne({
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

module.exports = ApplicationPhotosService