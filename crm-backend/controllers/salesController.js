const db = require('../utils/database');
const { validationResult } = require('express-validator');

// Get all deals with pagination and search
exports.getDeals = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT d.*, u.name as owner_name 
      FROM deals d 
      LEFT JOIN users u ON d.owner_id = u.id
      WHERE d.title LIKE ? OR d.company LIKE ?
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total FROM deals 
      WHERE title LIKE ? OR company LIKE ?
    `;

    const searchPattern = `%${search}%`;
    
    // Get total count
    db.query(countQuery, [searchPattern, searchPattern], (error, countResults) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      const total = countResults[0].total;
      
      // Get paginated results
      db.query(query, [searchPattern, searchPattern, parseInt(limit), parseInt(offset)], (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
          deals: results,
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

// Get single deal
exports.getDeal = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query(
      `SELECT d.*, u.name as owner_name 
       FROM deals d 
       LEFT JOIN users u ON d.owner_id = u.id
       WHERE d.id = ?`,
      [id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'Deal not found' });
        }

        res.status(200).json({ deal: results[0] });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create new deal
exports.createDeal = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, company, amount, stage, probability, owner_id, days_in_stage } = req.body;
    const created_by = req.userId;
    
    db.query(
      `INSERT INTO deals (title, company, amount, stage, probability, owner_id, days_in_stage, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, company, amount, stage, probability, owner_id, days_in_stage, created_by],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        // Get the newly created deal
        db.query(
          `SELECT d.*, u.name as owner_name 
           FROM deals d 
           LEFT JOIN users u ON d.owner_id = u.id
           WHERE d.id = ?`,
          [results.insertId],
          (error, dealResults) => {
            if (error) {
              return res.status(500).json({ message: 'Database error', error });
            }

            res.status(201).json({
              message: 'Deal created successfully',
              deal: dealResults[0]
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update deal
exports.updateDeal = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, company, amount, stage, probability, owner_id, days_in_stage } = req.body;
    
    db.query(
      `UPDATE deals 
       SET title = ?, company = ?, amount = ?, stage = ?, probability = ?, owner_id = ?, days_in_stage = ?
       WHERE id = ?`,
      [title, company, amount, stage, probability, owner_id, days_in_stage, id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Deal not found' });
        }

        // Get the updated deal
        db.query(
          `SELECT d.*, u.name as owner_name 
           FROM deals d 
           LEFT JOIN users u ON d.owner_id = u.id
           WHERE d.id = ?`,
          [id],
          (error, dealResults) => {
            if (error) {
              return res.status(500).json({ message: 'Database error', error });
            }

            res.status(200).json({
              message: 'Deal updated successfully',
              deal: dealResults[0]
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete deal
exports.deleteDeal = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query('DELETE FROM deals WHERE id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Deal not found' });
      }

      res.status(200).json({ message: 'Deal deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get sales stats
exports.getSalesStats = (req, res) => {
  try {
    // Get pipeline stages data
    const pipelineQuery = `
      SELECT stage, COUNT(*) as count, SUM(amount) as value 
      FROM deals 
      GROUP BY stage
    `;

    // Get overall stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total_deals,
        SUM(amount) as total_pipeline,
        AVG(amount) as avg_deal_size,
        COUNT(CASE WHEN stage = 'closed-won' THEN 1 END) as won_deals,
        COUNT(CASE WHEN stage = 'closed-lost' THEN 1 END) as lost_deals
      FROM deals
    `;

    db.query(pipelineQuery, (error, pipelineResults) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      db.query(statsQuery, (error, statsResults) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }

        const stats = statsResults[0];
        const winRate = stats.total_deals > 0 ? (stats.won_deals / stats.total_deals) * 100 : 0;

        res.status(200).json({
          pipeline: pipelineResults,
          stats: {
            totalPipeline: stats.total_pipeline || 0,
            winRate: winRate.toFixed(2),
            avgDealSize: stats.avg_deal_size || 0,
            totalDeals: stats.total_deals
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};