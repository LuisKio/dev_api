const express = require('express');
const { stripeWebhook } = require('../controllers/webhooks.controller');
const router = express.Router()



router
  .route('/stripe')
  .post(
    stripeWebhook
  );

module.exports = router