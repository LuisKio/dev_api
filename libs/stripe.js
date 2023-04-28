require('dotenv').config()
const stripeLocal = require('stripe')(process.env.STRIPE_SECRET);

module.exports = {
  stripeLocal
}