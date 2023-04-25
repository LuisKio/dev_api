'use strict'
const { Op } = require('sequelize')
const UsersService = require('../../services/users.service')

const userService = new UsersService()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, /*Sequelize*/) {
    /* eslint-disable quotes */
    const transaction = await queryInterface.sequelize.transaction()
    try {

      let user1 = await userService.findUserByEmailOr404('user1@academlo.com')
      // let user2 = await userService.findUserByEmailOr404('user2@academlo.com')
      // let user3 = await userService.findUserByEmailOr404('user3@academlo.com')

      await queryInterface.bulkInsert('applications', [
        {
          user_id: user1.id,
          legal_first_names: 'Alejandro',
          legal_last_names: 'Magno',
          nationality: 'Macedonia',
          email: 'egipto@academlo.com',
          phone: '019209309',
          date_of_birth: '2020-12-30T00:00:00.000Z',
          gender: 'Masculino',
          passport_number: '567890ASK987',
          passport_expiration_date: '2023-01-30T00:00:00.000Z',
          residence: 'Malibu',
          residence_address: 'AV Always Live #007',
          job: 'Commander',
          comments: 'Egiptian Investigator',
          status: 'draft',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {

      let user1 = await userService.findUserByEmailOr404('user1@academlo.com')

      await queryInterface.bulkDelete('applications', {
        user_id: {
          [Op.or]: [user1.id]
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}