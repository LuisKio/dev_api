const express = require('express');
const router = express.Router();
const { getApplication, getFile, createApplication, updateApplication, uploadPhotoApplication, uploadDocumentApplication, removeApplicationPhoto, removeApplicationDocuments } = require('../controllers/application.controller');

const passport = require('../libs/passport');
const verifySchema = require('../schemas/joiSchema.checker');
const { addApplicationSchema, updateApplicationSchema } = require('../schemas/applications.shemas');
const { multerApplicationsDocuments, multerApplicationsPhotos } = require('../middlewares/multer.middleware');
const { applicationIsNotConfirmed } = require('../middlewares/business_checker.middleware');
const { keyIsPhotoResource, keyIsDocumentResource, keyPhotoIsSameUser, keyDocumentIsSameUser } = require('../middlewares/s3-resource-validator.middleware');



router.get(
  '/application',
  getApplication
);

router.post(
  '/',
  verifySchema(addApplicationSchema, 'body'),
  createApplication
);

router.put(
  '/application',
  verifySchema(updateApplicationSchema, 'body'),
  updateApplication
);

router.route('/add-photo')
  .post(applicationIsNotConfirmed, multerApplicationsPhotos.array('photos',3), uploadPhotoApplication)

router.route('/add-document')
  .post(applicationIsNotConfirmed, multerApplicationsDocuments.array('documents',3), uploadDocumentApplication)

router.route('/remove-photo/:order')
  .delete(applicationIsNotConfirmed, removeApplicationPhoto)

router.route('/remove-document/:order')
  .delete(applicationIsNotConfirmed, removeApplicationDocuments)

router.route('/read-photo')
  .get(keyIsPhotoResource, keyPhotoIsSameUser,getFile)

router.route('/read-document')
  .get(keyIsDocumentResource, keyDocumentIsSameUser, getFile)


module.exports = router;