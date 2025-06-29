const form = document.getElementById('categoryForm');
const message = document.getElementById('categoryMessage');
const tableBody = document.getElementById('categoryTableBody');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const category_name = document.getElementById('category_name').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!category_name) {
    message.textContent = "Category name is required!";
    message.style.color = "red";
    return;
  }

  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_name, description })
    });

    const data = await res.json();

    if (res.ok) {
      message.textContent = data.message;
      message.style.color = "green";
      form.reset();
      loadCategories();
    } else {
      message.textContent = data.error || 'Error adding category';
      message.style.color = "red";
    }
  } catch (err) {
    message.textContent = "Network error";
    message.style.color = "red";
  }
});

async function loadCategories() {
  tableBody.innerHTML = '';

  const res = await fetch('/api/categories');
  const categories = await res.json();

  categories.forEach(cat => {
    const row = `<tr>
      <td>${cat.category_id}</td>
      <td>${cat.category_name}</td>
      <td>${cat.description || ''}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

// Load categories on page load
loadCategories();

// ===== Excel Upload Handling =====
const excelForm = document.getElementById('excelForm');
const excelFileInput = document.getElementById('excelFile');
const excelMessage = document.getElementById('excelMessage');

excelForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = excelFileInput.files[0];
  if (!file) {
    excelMessage.textContent = "Please select a file";
    excelMessage.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      excelMessage.textContent = result.message || "Upload successful";
      excelMessage.style.color = "green";
      loadProducts?.(); // call loadProducts() later when we build product table
    } else {
      excelMessage.textContent = result.error || "Upload failed";
      excelMessage.style.color = "red";
    }
  } catch (err) {
    excelMessage.textContent = "Network error during upload";
    excelMessage.style.color = "red";
  }
});


async function loadProducts() {
  const table = document.getElementById('productTableBody');
  table.innerHTML = '';

  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    products.forEach(prod => {
      const row = `<tr>
        <td>${prod.product_id}</td>
        <td>${prod.product_name}</td>
        <td>${prod.category_name}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
        <td>
  <button onclick="editProduct(${prod.product_id})">Edit</button>
  <button onclick="deleteProduct(${prod.product_id})" style="color: red;">Delete</button>
</td>

      </tr>`;
      table.innerHTML += row;
    });
  } catch (err) {
    console.error('Error loading products:', err);
  }
}
loadProducts();

async function editProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  document.getElementById('edit_product_id').value = product.product_id;
  document.getElementById('edit_product_name').value = product.product_name;
  document.getElementById('edit_price').value = product.price;
  document.getElementById('edit_stock').value = product.stock;

  // Load categories for dropdown
  const categoryRes = await fetch('/api/categories');
  const categories = await categoryRes.json();
  const select = document.getElementById('edit_category_id');
  select.innerHTML = '';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.category_id;
    opt.text = cat.category_name;
    if (cat.category_name === product.category_name) opt.selected = true;
    select.appendChild(opt);
  });

  document.getElementById('editProductForm').style.display = 'block';
}

document.getElementById('editProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const product_id = document.getElementById('edit_product_id').value;
  const product_name = document.getElementById('edit_product_name').value.trim();
  const category_id = document.getElementById('edit_category_id').value;
  const price = parseFloat(document.getElementById('edit_price').value);
  const stock = parseInt(document.getElementById('edit_stock').value);
  const msg = document.getElementById('editMessage');

  if (!product_name || price <= 0 || stock < 0) {
    msg.textContent = 'Invalid input';
    msg.style.color = 'red';
    return;
  }

  const res = await fetch(`/api/products/${product_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name, category_id, price, stock })
  });

  const data = await res.json();

  if (res.ok) {
    msg.textContent = data.message;
    msg.style.color = 'green';
    document.getElementById('editProductForm').reset();
    document.getElementById('editProductForm').style.display = 'none';
    loadProducts();
  } else {
    msg.textContent = data.error || 'Update failed';
    msg.style.color = 'red';
  }
});
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      loadProducts();
    } else {
      alert(data.error || 'Failed to delete product');
    }
  } catch (err) {
    alert('Network error during delete');
  }
}
