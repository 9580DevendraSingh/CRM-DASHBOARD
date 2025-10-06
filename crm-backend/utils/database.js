const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crm_database'
});

// Connect to database
db.connect(async (err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Initialize database tables
  try {
    await initDatabase();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
});

// Initialize database tables
const initDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Users table
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user') DEFAULT 'user',
          avatar TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Clients table
      await query(`
        CREATE TABLE IF NOT EXISTS clients (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          status ENUM('Active', 'Lead', 'Inactive') DEFAULT 'Lead',
          projects INT DEFAULT 0,
          revenue DECIMAL(15, 2) DEFAULT 0,
          avatar_color VARCHAR(7) DEFAULT '#4f46e5',
          created_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `);

      // Customers table
      await query(`
        CREATE TABLE IF NOT EXISTS customers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          company VARCHAR(255),
          status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
          orders INT DEFAULT 0,
          joined_date DATE,
          created_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `);

      // Sales pipeline table
      await query(`
        CREATE TABLE IF NOT EXISTS deals (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          amount DECIMAL(15, 2) NOT NULL,
          stage ENUM('discovery', 'proposal', 'negotiation', 'closed-won', 'closed-lost') DEFAULT 'discovery',
          probability VARCHAR(10) DEFAULT '0%',
          owner_id INT,
          days_in_stage INT DEFAULT 0,
          created_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `);

      // Reports table
      await query(`
        CREATE TABLE IF NOT EXISTS reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          type ENUM('sales', 'customers', 'revenue', 'products') NOT NULL,
          file_url TEXT,
          downloads INT DEFAULT 0,
          generated_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `);

      console.log('Database tables initialized successfully');

      // Create default admin user if not exists
      const [users] = await query('SELECT * FROM users WHERE email = ?', ['admin@crm.com']);
      
      if (users.length === 0) {
        const hashedPassword = await bcrypt.hash('password123', 12);
        await query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin User', 'admin@crm.com', hashedPassword, 'admin']
        );
        console.log('Default admin user created');
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to execute queries with promises
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = db;