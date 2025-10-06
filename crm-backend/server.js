const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Sequelize instance
const sequelize = require('./config/database');

// Import models and associations
const associations = require('./models/associations');

// Import routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const customerRoutes = require('./routes/customers');
const salesRoutes = require('./routes/sales');
const reportRoutes = require('./routes/reports');

// Database synchronization
const initializeDatabase = async () => {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Sync tables without foreign key constraints
    await sequelize.sync({ force: false });
    console.log('✅ All tables synchronized successfully.');

    // Enable foreign key checks back
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create default admin user
    const { User } = associations;
    const adminUser = await User.findOne({ where: { email: 'admin@crm.com' } });
    if (!adminUser) {
      await User.create({
        name: 'Admin User',
        email: 'admin@crm.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✅ Default admin user created successfully');
    }

    console.log('🎉 Database initialization completed!');

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    
    // Agar phir bhi error aaye toh simple sync try karo
    try {
      console.log('🔄 Trying simple sync without alter...');
      await sequelize.sync();
      console.log('✅ Tables synchronized successfully');
    } catch (syncError) {
      console.error('❌ Simple sync also failed:', syncError.message);
    }
  }
};

// Initialize database
initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running with Sequelize ORM!',
    timestamp: new Date().toISOString(),
    database: 'MySQL + Sequelize'
  });
});

// Database initialization endpoint
app.get('/api/init-db', async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ 
      message: 'Database initialized successfully!',
      alert: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database initialization error',
      error: error.message 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRM Backend API',
    version: '1.0.0',
    orm: 'Sequelize',
    database: 'MySQL',
    endpoints: {
      auth: '/api/auth',
      clients: '/api/clients',
      customers: '/api/customers', 
      sales: '/api/sales',
      reports: '/api/reports',
      health: '/api/health',
      init_db: '/api/init-db'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️ ORM: Sequelize`);
  console.log(`🔄 Automatic table synchronization: ENABLED`);
});