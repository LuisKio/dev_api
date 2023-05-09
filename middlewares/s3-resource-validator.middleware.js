const { CustomError } = require('../utils/helpers')
const checkStartsWith = (string, resource) => {
  return String(string).startsWith(resource)
}

let applicationPhotoResource = 'applications/photos/photo-'
let applicationDocumentResource = 'applications/documents/document-'

const keyIsPhotoResource = async (req, res, next) => {
  try {
    let awsKey = req.query.key;
    let isResource = checkStartsWith(awsKey, applicationPhotoResource);

    if (isResource) {
      next();
    } else {
      throw new CustomError(
        `The Key ${awsKey} is not for this resource`,
        400,
        'Bad Request'
      );
    }
  } catch (error) {
    next(error);
  }
};


const keyPhotoIsSameUser = async (req, res, next) => {
  try {
    let awsKey = req.query.key;
    let userID = req.user.id;

    let containsID = String(awsKey).includes(
      userID,
      applicationPhotoResource.length
    );

    if (containsID) {
      next();
    } else {
      throw new Error(`The Key ${awsKey} is not the same as ID param`);
    }
  } catch (error) {
    next(error);
  }
};


const keyIsDocumentResource = async (req, res, next) => {
  try {
    let awsKey = req.query.key;
    let isResource = checkStartsWith(awsKey, applicationDocumentResource);

    if (isResource) {
      next();
    } else {
      throw new CustomError(
        `The Key ${awsKey} is not for this resource`,
        400,
        'Bad Request'
      );
    }
  } catch (error) {
    next(error);
  }
};


const keyDocumentIsSameUser = async (req, res, next) => {
  try {
    let awsKey = req.query.key;
    let userID = req.user.id;

    let containsID = String(awsKey).includes(
      userID,
      applicationDocumentResource.length
    );

    if (containsID) {
      next();
    } else {
      throw new Error(`The Key ${awsKey} is not the same as ID param`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  keyIsPhotoResource,
  keyPhotoIsSameUser,
  keyIsDocumentResource,
  keyDocumentIsSameUser
}
