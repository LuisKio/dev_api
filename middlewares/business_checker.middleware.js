
const ApplicationsService = require('../services/applications.service');
const { CustomError } = require('../utils/helpers');

const applicationsService = new ApplicationsService()

const applicationIsNotConfirmed = async (request, response, next) => {
  try {
    let { id } = request.user
    let application = await applicationsService.getApplicationOr404raw(id)
    if (application.status != 'confirmed') return next()

    throw new CustomError('Application have the Status as confirmed', 403, 'Permission Denied')
  } catch (error) {
    return next(error);
  }
};

const applicationIsConfirmedOrErr = async (request, response, next) => {
  try {
    let { id } = request.user
    let application = await applicationsService.getApplicationOr404raw(id)
    
    if (application.status != 'confirmed') throw new CustomError('Application is not Confirmed', 403, 'Permission Denied')

    return next()
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  applicationIsNotConfirmed,
  applicationIsConfirmedOrErr
}







