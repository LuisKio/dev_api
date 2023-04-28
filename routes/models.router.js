const express = require('express')
// const routesUsers = require('./users.routes')

// const isAuthenticatedByPassportJwt = require('../libs/passport')

const routesAuth = require('./auth.routes')
const routesApplication = require('./applications.routes');
const routesPayments = require('./payments.routes')
const routesWebhooks = require('./webhooks.routes')

//PASSPORT NOS PERMITIRA SABER SI UN USUARIO ESTA AUTENTICADO
const passport = require('../libs/passport');

function routerModels(app) {
  const router = express.Router()

  app.use('/api/v1', router)
  router.use('/auth', routesAuth)
  router.use('/applications', passport.authenticate('jwt', { session: false }), routesApplication);
  router.use('/payments', routesPayments)
  router.use('/webhooks', routesWebhooks)
}

module.exports = routerModels
