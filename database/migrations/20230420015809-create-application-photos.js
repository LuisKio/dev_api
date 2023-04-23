'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async(queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('application_photos', {
        application_id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          foreignKey: true,
          references: {
            model: 'applications',
            key: 'user_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        }
      }, {transaction});
      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  },
  down: async(queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('application_photos', {transaction});
      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
};