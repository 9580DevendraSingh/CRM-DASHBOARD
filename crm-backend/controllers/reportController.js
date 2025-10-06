const db = require('../utils/database');
const { validationResult } = require('express-validator');

// Get all reports with pagination and search
exports.getReports = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', type } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.name as generated_by_name 
      FROM reports r 
      LEFT JOIN users u ON r.generated_by = u.id
      WHERE (r.title LIKE ? OR r.description LIKE ?)
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM reports 
      WHERE (title LIKE ? OR description LIKE ?)
    `;

    const searchPattern = `%${search}%`;
    let queryParams = [searchPattern, searchPattern];
    let countParams = [searchPattern, searchPattern];

    // Add type filter if provided
    if (type && type !== 'all') {
      query += ' AND r.type = ?';
      countQuery += ' AND type = ?';
      queryParams.push(type);
      countParams.push(type);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Get total count
    db.query(countQuery, countParams, (error, countResults) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      const total = countResults[0].total;
      
      // Get paginated results
      db.query(query, queryParams, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
          reports: results,
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

// Get single report
exports.getReport = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query(
      `SELECT r.*, u.name as generated_by_name 
       FROM reports r 
       LEFT JOIN users u ON r.generated_by = u.id
       WHERE r.id = ?`,
      [id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ report: results[0] });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create new report
exports.createReport = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, type, file_url } = req.body;
    const generated_by = req.userId;
    
    db.query(
      `INSERT INTO reports (title, description, type, file_url, generated_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, type, file_url, generated_by],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        // Get the newly created report
        db.query(
          `SELECT r.*, u.name as generated_by_name 
           FROM reports r 
           LEFT JOIN users u ON r.generated_by = u.id
           WHERE r.id = ?`,
          [results.insertId],
          (error, reportResults) => {
            if (error) {
              return res.status(500).json({ message: 'Database error', error });
            }

            res.status(201).json({
              message: 'Report created successfully',
              report: reportResults[0]
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update report
exports.updateReport = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, description, type, file_url } = req.body;
    
    db.query(
      `UPDATE reports 
       SET title = ?, description = ?, type = ?, file_url = ?
       WHERE id = ?`,
      [title, description, type, file_url, id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Report not found' });
        }

        // Get the updated report
        db.query(
          `SELECT r.*, u.name as generated_by_name 
           FROM reports r 
           LEFT JOIN users u ON r.generated_by = u.id
           WHERE r.id = ?`,
          [id],
          (error, reportResults) => {
            if (error) {
              return res.status(500).json({ message: 'Database error', error });
            }

            res.status(200).json({
              message: 'Report updated successfully',
              report: reportResults[0]
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete report
exports.deleteReport = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query('DELETE FROM reports WHERE id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }

      res.status(200).json({ message: 'Report deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Increment report download count
exports.incrementDownloadCount = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query(
      'UPDATE reports SET downloads = downloads + 1 WHERE id = ?',
      [id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ message: 'Download count updated' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};