const ApplicationsService = require('../services/applications.service');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const { CustomError } = require('../utils/helpers')
const { uploadFile, deleteFile, getFileStream } = require('../libs/s3')


const ApplicationsPhotosService = require('../services/applications-photos.service')
const ApplicationDocumentsService = require('../services/applications-documents.service')


const applicationsPhotosService = new ApplicationsPhotosService()
const applicationDocumentsService = new ApplicationDocumentsService()

const appService = new ApplicationsService();




const getApplication = async (request, response, next) => {
  const { id } = request.user;

  try {
    const application = await appService.getApplication(id);
    response.status(200).json({
      results: application
    });
  } catch (error) {
    next(error);
  }
}

//Verificar si el email sera el del usuario logeado o puede ser cualquiera
const createApplication = async (request, response, next) => {
  try {
    let { body } = request;
    let { id } = request.user;

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
    let { id } = request.user;
    let { body } = request;

    if (!body.user_id) {
      //console.log('entro');
      // Verifica si la aplicacion existe y si el estado es diferente a draft
      await appService.getStatusAppliction(id);
      let updateApp = await appService.updateApplication(id, body);
    }

    return response.status(200).json({
      results: 'Updated app',
    });
  } catch (error) {
    next(error);
  }
}


//para photos


const uploadPhotoApplication = async (request, response, next) => {
  
  const application_id = request.user.id
  const files = request.files;
  try {
    if (files.length < 1) throw new CustomError('No images received', 400, 'Bad Request');

    let imagesKeys = [];
    let imagesErrors = [];

    let openSpots = await applicationsPhotosService.getAvailablePhotosOrders(application_id)

    await Promise.all(

      openSpots.map(async (spot, index) => {
        try {
          /* In case Open Spots > Images Posted */
          if (!files[index]) return

          let fileKey = `applications/photos/photo-${application_id}-${spot}`;
  
          if (files[index].mimetype == 'image/png') {
            fileKey = `applications/photos/photo-${application_id}-${spot}.png`;
          }
  
          if (files[index].mimetype == 'image/jpg') {
            fileKey = `applications/photos/photo-${application_id}-${spot}.jpg`;
          }
  
          if (files[index].mimetype == 'image/jpeg') {
            fileKey = `applications/photos/photo-${application_id}-${spot}.jpeg`;
          }
  
          await uploadFile(files[index], fileKey);
  
          /* Without DOMAIN because is not public */
          // let bucketURL = process.env.AWS_DOMAIN + fileKey;
  
          let newPhotoApplication = await applicationsPhotosService.createPhoto(
            application_id,
            fileKey,
            spot
          );

          imagesKeys.push(fileKey)

        } catch (error) {
          imagesErrors.push(error.message)
        }
      })
    );

    //At the end of everything, clean the server from the images
    await Promise.all(
      files.map(async (file) => {
        try {
          await unlinkFile(file.path);
        } catch (error) {
          //
        }
      })
    );

    return response
      .status(200)
      .json({ results: { message: `Count of uploaded photos: ${imagesKeys.length} `, photosUploaded: imagesKeys , photoErrors: imagesErrors} });

  } catch (error) {
    if (files) {
      await Promise.all(
        files.map(async (file) => {
          try {
            await unlinkFile(file.path);
          } catch (error) {
            //
          }
        })
      );
    }
    return next(error);
  }
};



const removeApplicationPhoto = async (request, response, next) => {
  const application_id = request.user.id
  const order = request.params.order
  try {

    let {url} = await applicationsPhotosService.getPhotoOr404(application_id, order)
    
    /* Commented because we are not storing the DOMAIN */
    // let awsDomain = process.env.AWS_DOMAIN
    // const imageKey = image_url.replace(awsDomain, '')
    // await deleteFile(imageKey)
    
    await deleteFile(url)
    let applicationPhoto = await applicationsPhotosService.removePhoto(application_id, order)

    return response.status(200).json({ message: 'Removed', photo: applicationPhoto })
  } catch (error) {
    next(error)
  }
}

//documents

const uploadDocumentApplication = async (request, response, next) => {
  
  const application_id = request.user.id
  const files = request.files;

  try {
    if (files.length < 1) throw new CustomError('No documents received', 400, 'Bad Request');

    let documentsKeys = [];
    let documentsErrors = [];

    let openSpots = await applicationDocumentsService.getAvailableDocumentsOrders(application_id)

    await Promise.all(

      openSpots.map(async (spot, index) => {
        try {
          /* In case Open Spots > Images Posted */
          if (!files[index]) return

          let fileKey = `applications/documents/document-${application_id}-${spot}`;
  
          if (files[index].mimetype == 'application/pdf') {
            fileKey = `applications/documents/document-${application_id}-${spot}.pdf`;
          }
  
          await uploadFile(files[index], fileKey);
  
          /* Without DOMAIN because is not public */
          // let bucketURL = process.env.AWS_DOMAIN + fileKey;
  
          let newDocumentApplication = await applicationDocumentsService.createDocument(
            application_id,
            fileKey,
            spot
          );

          documentsKeys.push(fileKey)

        } catch (error) {
          documentsErrors.push(error.message)
        }
      })
    );

    //At the end of everything, clean the server from the images
    await Promise.all(
      files.map(async (file) => {
        try {
          await unlinkFile(file.path);
        } catch (error) {
          //
        }
      })
    );

    return response
      .status(200)
      .json({ results: { message: `Count of uploaded documents: ${documentsKeys.length} `, documentsUploaded: documentsKeys , documentsErrors: documentsErrors} });

  } catch (error) {
    if (files) {
      await Promise.all(
        files.map(async (file) => {
          try {
            await unlinkFile(file.path);
          } catch (error) {
            //
          }
        })
      );
    }
    return next(error);
  }
};

const removeApplicationDocuments = async (request, response, next) => {
  const application_id = request.user.id
  const order = request.params.order
  try {

    let {url} = await applicationDocumentsService.getDocumentOr404(application_id, order)
    
    /* Commented because we are not storing the DOMAIN */
    // let awsDomain = process.env.AWS_DOMAIN
    // const imageKey = image_url.replace(awsDomain, '')
    // await deleteFile(imageKey)
    
    await deleteFile(url)
    let applicationDocument = await applicationDocumentsService.removeDocument(application_id, order)

    return response.status(200).json({ message: 'Removed', document: applicationDocument })
  } catch (error) {
    next(error)
  }
}




module.exports = {
  getApplication,
  createApplication,
  updateApplication,
  uploadDocumentApplication,
  uploadPhotoApplication,
  removeApplicationDocuments,
  removeApplicationPhoto
}