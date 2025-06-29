const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products with category name
router.get('/', (req, res) => {
  const query = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.price, 
      p.stock, 
      c.category_name
    FROM product p
    JOIN category c ON p.category_id = c.category_id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new product
router.post('/', (req, res) => {
  const { product_name, price, stock, category_id } = req.body;

  if (!product_name || !price || !stock || !category_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO product (product_name, price, stock, category_id) VALUES (?, ?, ?, ?)';
  db.query(query, [product_name, price, stock, category_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ message: 'Product added successfully', product_id: result.insertId });
  });
});

module.exports = router;

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.*, c.category_name
    FROM product p
    JOIN category c ON p.category_id = c.category_id
    WHERE p.product_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { product_name, category_id, price, stock } = req.body;

  if (!product_name || price <= 0 || stock < 0 || !category_id)
    return res.status(400).json({ error: 'Invalid input' });

  const sql = `
    UPDATE product
    SET product_name = ?, category_id = ?, price = ?, stock = ?
    WHERE product_id = ?
  `;
  db.query(sql, [product_name, category_id, price, stock, id], (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Product updated successfully' });
  });
});
// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM product WHERE product_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  });
});
