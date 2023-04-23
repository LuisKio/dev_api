'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApplicationPhotos extends Model {
    static associate(models) {
      ApplicationPhotos.belongsTo(models.Applications, {as: 'application', foreignKey: 'application_id'});
    }
  }
  ApplicationPhotos.init({
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
    modelName: 'ApplicationPhotos',
    tableName: 'application_photos',
    underscored: true,
    timestamps: true
  });
  return ApplicationPhotos;
};