# 🛒 E-commerce CRUD App

This is a simple and beginner-friendly e-commerce CRUD web application developed as a personal project. It supports adding and managing categories and products, along with Excel file upload support.

> 🔰 Developed by **Prasanna Seeram**, Fresher Full Stack Developer.

---

## 📌 Features

- 🗂️ Add / Edit / Delete Categories
- 📦 Manage Products with details
- 📁 Upload products via Excel file
- 📊 View Products grouped by Category
- ✅ Form validations on frontend
- 🧾 User-friendly interface

---

## 🛠 Tech Stack Used

| Layer         | Technology           |
|---------------|-----------------------|
| Frontend      | HTML, CSS, JavaScript |
| Backend       | Node.js + Express     |
| Database      | MySQL                 |
| Excel Upload  | `xlsx` npm package    |

---

## 🧑‍💻 How to Run the App Locally

### 1. Clone the Repository

```bash
git clone https://github.com/PrasannaSeeram/ecommerce-crud-app.git
cd ecommerce-crud-app

### 2. Install dependencies  
   `npm install`

### 3. Set up your `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=ecommerce_db
### 4. Start the server
node index.js

### 5. Open your browser:
http://localhost:3000

## 📂 Folder Structure

ecommerce-crud-app/
├── index.js                 # Entry point
├── db.js                    # MySQL config
├── /routes                  # API routes (category, product, upload)
│   ├── category.js
│   ├── product.js
│   └── upload.js
├── /public                  # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── /uploads                 # Temp Excel files
├── package.json
└── README.md

## 📦 Author
Surya Prasanna Seeram
Fresher Full Stack Developer — building and learning ❤️
