const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  stage: {
    type: DataTypes.ENUM('discovery', 'proposal', 'negotiation', 'closed-won', 'closed-lost'),
    defaultValue: 'discovery'
  },
  probability: {
    type: DataTypes.STRING(10),
    defaultValue: '0%'
  },
  days_in_stage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'deals',
  timestamps: false
});

module.exports = Deal;