const ApplicationsService = require('../services/applications.service');
const { CustomError } = require('../utils/helpers');

const appService = new ApplicationsService();

const getApplication = async (request, response, next) => {
  const { id } = request.user;

  try {
    const application = await appService.getApplication(id);
    response.status(200).json(application);
  } catch (error) {
    next(error);
  }
}

//Verificar si el email sera el del usuario logeado o puede ser cualquiera
const createApplication = async (request, response, next) => {
  try {
    let { body } = request;
    let { id } = request.user;

    for (let keyword in body) {
      body[keyword] = body[keyword].toLowerCase();
    }

    body.status = 'draft';
    body.user_id = id;

    await appService.createApplication(body);

    return response
      .status(201)
      .json({
        results: 'Application created'
      });
  } catch (error) {
    next(error);
  }
}

const updateApplication = async (request, response, next) => {
  try {
    let {id} = request.user;
    let {body} = request;
    
    // Verifica si la aplicacion existe y si el estado es diferente a draft
    await appService.getStatusAppliction(id);

    for (let keyword in body) {
      body[keyword] = body[keyword].toLowerCase();
    }

    let updateApp = await appService.updateApplication(id, body);

    return response.status(200).json({
      results: 'Updated app',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getApplication,
  createApplication,
  updateApplication
}