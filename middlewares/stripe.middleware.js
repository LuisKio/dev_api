const ApplicationsService = require("../services/applications.service");
const UsersService = require("../services/users.service");

const applicationsService = new ApplicationsService()
const userService = new UsersService()
const getOrCreateStripeUserByEmail = async (request, response, next) => {
    try {
      let { id, email } = request.user
      
      let user = await userService.getUserStripeClient(id)
      if (user.stripe_client) {
        return next()
      }
      
      /* Si no tiene un Client, le creará uno */
      const customer = await stripeLocal.customers.create({
        email
      });
  
      let createClient = await UsersService.createStripeClient(id, customer.id)
  
      return next()
    } catch (error) {
      return next(error);
    }
  };

  const applicationIsConfirmedOrErr = async (request, response, next) => {
    try {
      let { id } = request.user
      let application = await applicationsService.getApplicationOr404raw(id)
      
      if (application.status != 'confirmed') throw new CustomError('Application is not Confirmed', 403, 'Permission Denied')
  
      return next()
    } catch (error) {
      return next(error);
    }
  };

  module.exports = {
    getOrCreateStripeUserByEmail,
    applicationIsConfirmedOrErr
  }