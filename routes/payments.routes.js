const express = require('express');
const router = express.Router();
const passport = require('../libs/passport');
const { applicationIsConfirmedOrErr, getOrCreateStripeUserByEmail } = require('../middlewares/stripe.middleware');
const { stripeCheckout } = require('../controllers/stripe.controller');

router
  .route('/pay-product')
  .post(
    passport.authenticate('jwt', { session: false }),
    applicationIsConfirmedOrErr,
    getOrCreateStripeUserByEmail,
    stripeCheckout
  );

module.exports = router