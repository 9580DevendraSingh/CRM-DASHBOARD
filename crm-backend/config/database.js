const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'crm_database',
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_unicode_ci'
      }
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      decimalNumbers: true
    },
    timezone: '+05:30', // India timezone
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Sequelize unable to connect to the database:', err);
  });

module.exports = sequelize;