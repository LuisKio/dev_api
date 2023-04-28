const { CustomError } = require('../utils/helpers')
const { stripeLocal } = require('../libs/stripe')

const ApplicationsService = require('../services/applications.service')
const UsersService = require('../services/users.service')

const applicationsService = new ApplicationsService()
const usersService = new UsersService()

require('dotenv').config()

const endpointSecret = process.env.STRIPE_CLI_WEBHOOK_SECRET;

const stripeWebhook = async (request, response, next) => {
  const sig = request.headers['stripe-signature'];
  let event;
  
  try {
    if (!endpointSecret) throw new CustomError('Not STRIPE W SECRET provided in app',500,'ENV Required')
  } catch (error) {
    next(error)
  }

  try {
    event = stripeLocal.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
  case 'checkout.session.completed':{
    let paid = event.data.object.payment_status

    if(paid == 'paid') {
      let payment_intent = event.data?.object?.payment_intent
      let client_id = event.data?.object?.customer

      let localStripeUser = await usersService.getStripeClientUser(client_id)
      let createApplicationPayment = await applicationsService.addPaymentInfo(localStripeUser.user_id,payment_intent)
    }
    break
  }
  default:
  // ... handle other event types
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send();
};

module.exports = {
    stripeWebhook
}