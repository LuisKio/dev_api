'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersStripe extends Model {
    static associate(models) {
      UsersStripe.belongsTo(models.Users, {as: 'user', foreignKey: 'user_id'});
    }
  }
  UsersStripe.init({
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'UsersStripe',
    tableName: 'users_stripe',
    underscored: true,
    timestamps: true
  });
  return UsersStripe;
};