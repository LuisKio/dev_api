const express = require('express');
const router = express.Router();
const passport = require('../libs/passport');
const { applicationIsConfirmedOrErr, getOrCreateStripeUserByEmail, stripeCheckout } = require('../middlewares/stripe.middleware');

router
  .route('/pay-product')
  .post(
    passport.authenticate('jwt', { session: false }),
    applicationIsConfirmedOrErr,
    getOrCreateStripeUserByEmail,
    stripeCheckout
  );

module.exports = router