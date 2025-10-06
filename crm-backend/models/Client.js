const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Lead', 'Inactive'),
    defaultValue: 'Lead'
  },
  projects: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  revenue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  avatar_color: {
    type: DataTypes.STRING(7),
    defaultValue: '#4f46e5'
  }
}, {
  tableName: 'clients',
  timestamps: false
});

module.exports = Client;