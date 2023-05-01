const models = require('../database/models')
const { Op } = require('sequelize')
const  {CustomError}  = require('../utils/helpers');

class ProductsService {

  constructor() {
  }

  async findAndCount(query) {
    const options = {
      where: {},
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true

    const products = await models.Products.findAndCountAll(options)
    return products
  }

  async returnProducts() {
    const options = {
    }
    
    options.distinct = true

    const products = await models.Products.findAll(options)
    return products
  }

}

module.exports = ProductsService