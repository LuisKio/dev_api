'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApplicationPayments extends Model {
    static associate(models) {
      ApplicationPayments.belongsTo(models.Applications, {as: 'application', foreignKey: 'application_id'});
    }
  }
  ApplicationPayments.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    payment_intent: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ApplicationPayments',
    tableName: 'application_payments',
    underscored: true,
    timestamps: true
  });
  return ApplicationPayments;
};