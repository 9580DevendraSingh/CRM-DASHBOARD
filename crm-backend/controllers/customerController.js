const db = require('../utils/database');
const { validationResult } = require('express-validator');

// Get all customers with pagination and search
exports.getCustomers = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM customers 
      WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total FROM customers 
      WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
    `;

    const searchPattern = `%${search}%`;
    
    // Get total count
    db.query(countQuery, [searchPattern, searchPattern, searchPattern], (error, countResults) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      const total = countResults[0].total;
      
      // Get paginated results
      db.query(query, [searchPattern, searchPattern, searchPattern, parseInt(limit), parseInt(offset)], (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
          customers: results,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit)
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single customer
exports.getCustomer = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query('SELECT * FROM customers WHERE id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({ customer: results[0] });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create new customer
exports.createCustomer = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, company, status, orders, joined_date } = req.body;
    const created_by = req.userId;
    
    db.query(
      `INSERT INTO customers (name, email, phone, company, status, orders, joined_date, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, company, status, orders, joined_date, created_by],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        // Get the newly created customer
        db.query('SELECT * FROM customers WHERE id = ?', [results.insertId], (error, customerResults) => {
          if (error) {
            return res.status(500).json({ message: 'Database error', error });
          }

          res.status(201).json({
            message: 'Customer created successfully',
            customer: customerResults[0]
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update customer
exports.updateCustomer = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, email, phone, company, status, orders, joined_date } = req.body;
    
    db.query(
      `UPDATE customers 
       SET name = ?, email = ?, phone = ?, company = ?, status = ?, orders = ?, joined_date = ?
       WHERE id = ?`,
      [name, email, phone, company, status, orders, joined_date, id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Customer not found' });
        }

        // Get the updated customer
        db.query('SELECT * FROM customers WHERE id = ?', [id], (error, customerResults) => {
          if (error) {
            return res.status(500).json({ message: 'Database error', error });
          }

          res.status(200).json({
            message: 'Customer updated successfully',
            customer: customerResults[0]
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete customer
exports.deleteCustomer = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query('DELETE FROM customers WHERE id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({ message: 'Customer deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};