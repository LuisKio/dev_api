'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Applications extends Model {   
    static associate(models) {
      Applications.belongsTo(models.Users, {as: 'user', foreignKey: 'user_id'});
      Applications.hasMany(models.ApplicationPhotos, {as: 'photos', foreignKey:'application_id'});
      Applications.hasMany(models.ApplicationDocuments, {as: 'documents', foreignKey:'application_id'});
      Applications.hasMany(models.ApplicationPayments, {as: 'payments', foreignKey:'application_id'});
    }
  }
  Applications.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,      
    },
    legal_first_names: {
      type: DataTypes.STRING,
      allowNull: false
    },
    legal_last_names: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passport_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passport_expiration_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    residence: {
      type: DataTypes.STRING,
      allowNull: false
    },
    residence_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    job: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Applications',
    tableName: 'applications',
    underscored: true,
    timestamps: true,
    scopes: {
      get_application: {
        attributes: [
          'legal_first_names',
          'legal_last_names',
          'nationality',
          'email',
          'phone',
          'date_of_birth',
          'gender',
          'passport_number',
          'passport_expiration_date',
          'residence',
          'residence_address',
          'job',
          'comments',
          'status',
        ]
      },
      view_status: {attributes: ['status']}
    }
  });
  return Applications;
};