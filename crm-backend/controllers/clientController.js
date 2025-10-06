const db = require('../utils/database');
const { validationResult } = require('express-validator');

// Get all clients with pagination and search
exports.getClients = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM clients 
      WHERE name LIKE ? OR company LIKE ? OR email LIKE ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total FROM clients 
      WHERE name LIKE ? OR company LIKE ? OR email LIKE ?
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
          clients: results,
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

// Get single client
exports.getClient = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query('SELECT * FROM clients WHERE id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.status(200).json({ client: results[0] });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create new client
exports.createClient = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, company, email, phone, status, projects, revenue } = req.body;
    const created_by = req.userId;
    
    db.query(
      `INSERT INTO clients (name, company, email, phone, status, projects, revenue, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, company, email, phone, status, projects, revenue, created_by],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        // Get the newly created client
        db.query('SELECT * FROM clients WHERE id = ?', [results.insertId], (error, clientResults) => {
          if (error) {
            return res.status(500).json({ message: 'Database error', error });
          }

          res.status(201).json({
            message: 'Client created successfully',
            client: clientResults[0]
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update client
exports.updateClient = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, company, email, phone, status, projects, revenue } = req.body;
    
    db.query(
      `UPDATE clients 
       SET name = ?, company = ?, email = ?, phone = ?, status = ?, projects = ?, revenue = ?
       WHERE id = ?`,
      [name, company, email, phone, status, projects, revenue, id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Client not found' });
        }

        // Get the updated client
        db.query('SELECT * FROM clients WHERE id = ?', [id], (error, clientResults) => {
          if (error) {
            return res.status(500).json({ message: 'Database error', error });
          }

          res.status(200).json({
            message: 'Client updated successfully',
            client: clientResults[0]
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete client
exports.deleteClient = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query('DELETE FROM clients WHERE id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.status(200).json({ message: 'Client deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};