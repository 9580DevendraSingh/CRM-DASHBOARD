const User = require('./User');
const Client = require('./Client');
const Customer = require('./Customer');
const Deal = require('./Deal');
const Report = require('./Report');

// Define relationships
User.hasMany(Client, { foreignKey: 'created_by', as: 'clients' });
Client.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Customer, { foreignKey: 'created_by', as: 'customers' });
Customer.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Deal, { foreignKey: 'owner_id', as: 'owned_deals' });
User.hasMany(Deal, { foreignKey: 'created_by', as: 'created_deals' });
Deal.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Deal.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Report, { foreignKey: 'generated_by', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'generated_by', as: 'generator' });

console.log('✅ Database relationships defined successfully');

module.exports = {
  User,
  Client,
  Customer,
  Deal,
  Report
};