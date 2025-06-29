const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Routes
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const uploadRoutes = require('./routes/upload');

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Register API routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
