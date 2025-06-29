const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('../db');
const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets['Products'];
    if (!sheet) return res.status(400).json({ error: 'Sheet "Products" not found' });

    const rows = xlsx.utils.sheet_to_json(sheet);
    let successCount = 0;
    let errors = [];

    const insertPromises = rows.map((row, index) => {
      const { product_name, category_name, price, stock } = row;
      if (!product_name || !category_name || price <= 0 || stock < 0) {
        errors.push(`Row ${index + 2}: Invalid or missing fields`);
        return;
      }

      return new Promise((resolve) => {
        db.query('SELECT category_id FROM category WHERE category_name = ?', [category_name], (err, results) => {
          if (err || results.length === 0) {
            errors.push(`Row ${index + 2}: Category "${category_name}" not found`);
            return resolve();
          }

          const category_id = results[0].category_id;
          db.query(
            'INSERT INTO product (product_name, price, stock, category_id) VALUES (?, ?, ?, ?)',
            [product_name, price, stock, category_id],
            (err) => {
              if (err) {
                errors.push(`Row ${index + 2}: DB insert failed`);
              } else {
                successCount++;
              }
              resolve();
            }
          );
        });
      });
    });

    Promise.all(insertPromises).then(() => {
      const msg = `✅ Uploaded ${successCount} products`;
      if (errors.length) {
        res.status(400).json({ error: msg + ', but some errors:', details: errors });
      } else {
        res.json({ message: msg });
      }
    });
  } catch (error) {
    console.error("🔥 Upload Error:", error);
    res.status(500).json({ error: 'Server error while processing file' });
  }
});

module.exports = router;
