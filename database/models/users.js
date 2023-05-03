'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasOne(models.UsersStripe, {as: 'stripe_client', foreignKey: 'user_id'});
      Users.hasOne(models.Applications, {as: 'application', foreignKey: 'user_id'})
    }
  }
  Users.init({
    id: {
      type:DataTypes.UUID,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email_verified: {
      type: DataTypes.DATE
    },
    token: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    scopes: {
      view_public: {attributes: ['id']},
      view_same_user: {attributes: ['id','email']},
      auth_flow: {attributes: ['id', 'email']},
      view_me: {attributes: ['id', 'email']}
    },
    hooks: {
      beforeCreate: (user, options) => {
        if (user.email){
          let emailLowercase = String(user.email).toLocaleLowerCase()
          user.email = emailLowercase
        }
      }
    }
  });
  return Users;
};