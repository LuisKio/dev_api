const express = require('express');
const router = express.Router();
const { getApplication, createApplication, updateApplication } = require('../controllers/application.controller');

const verifySchema = require('../schemas/joiSchema.checker');
const { addApplicationSchema, updateApplicationSchema } = require('../schemas/applications.shemas');

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

module.exports = router;