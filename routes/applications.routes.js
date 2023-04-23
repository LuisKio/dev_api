const express = require('express');
const router = express.Router();
const { getApplication, createApplication, updateApplication } = require('../controllers/application.controller');

//PASSPORT NOS PERMITIRA SABER SI UN USUARIO ESTA AUTENTICADO
const passport = require('../libs/passport');

const verifySchema = require('../schemas/joiSchema.checker');
const { addApplicationSchema, updateApplicationSchema } = require('../schemas/applications.shemas');

router.get(
  '/application',
  passport.authenticate('jwt', { session: false }),
  getApplication
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  verifySchema(addApplicationSchema, 'body'),
  createApplication
);

router.put(
  '/application',
  passport.authenticate('jwt', { session: false }),
  verifySchema(updateApplicationSchema, 'body'),
  updateApplication
);

module.exports = router;