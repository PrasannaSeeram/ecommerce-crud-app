const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // 👉 change if your MySQL user is different
  password: 'root',          // 👉 enter your MySQL password here
  database: 'ecommerce_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

module.exports = db;
