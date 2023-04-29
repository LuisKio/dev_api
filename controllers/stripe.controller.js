const ProductsService = require("../services/products.services")
const UsersService = require("../services/users.service")
const { CustomError } = require("../utils/helpers")


const userService = new UsersService()
const productService = new ProductsService()

const stripeCheckout = async (request, response, next) => {
    try {
  
      let { id } = request.user
  
      /* We checked in the middleware before that, user will always have one */
      let userClient = await userService.getUserStripeClient(id)
  
      let products = await productService.returnProducts()
  
      if (products.length == 0) throw new CustomError('Not Products on the local DB', 500, 'Application Error')
  
      if (products.length > 1) throw new CustomError('More than one product in the local DB, this endpoint only allow one product', 500, 'Application Error')
  
      const session = await stripeLocal.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        currency: 'usd',
        customer: userClient.stripe_client?.client_id,
        line_items: [{
          price: products[0].price_id,
          quantity: 1
        }],
        success_url: request.body.success_url,
        cancel_url: request.body.cancel_url,
      });
      return response.status(201).json({ url: session.url })
    } catch (error) {
      next(error)
    }
  }

  module.exports = {
    stripeCheckout
  }