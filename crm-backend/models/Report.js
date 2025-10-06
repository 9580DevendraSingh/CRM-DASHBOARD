const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('sales', 'customers', 'revenue', 'products'),
    allowNull: false
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'reports',
  timestamps: false
});

module.exports = Report;