'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApplicationDocuments extends Model {
    static associate(models) {
      ApplicationDocuments.belongsTo(models.Applications, {as: 'application', foreignKey: 'application_id'})
    }
  }
  ApplicationDocuments.init({
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ApplicationDocuments',
    tableName: 'application_documents',
    underscored: true,
    timestamps: true

  });
  return ApplicationDocuments;
};