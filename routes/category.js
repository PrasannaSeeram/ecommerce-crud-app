const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all categories
router.get('/', (req, res) => {
  db.query('SELECT * FROM category', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new category
router.post('/', (req, res) => {
  const { category_name, description } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "category_name is required" });
  }

  const query = 'INSERT INTO category (category_name, description) VALUES (?, ?)';
  db.query(query, [category_name, description], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Category already exists' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: 'Category added successfully', category_id: result.insertId });
  });
});

module.exports = router;
