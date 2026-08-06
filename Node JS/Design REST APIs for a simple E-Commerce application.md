Here is a complete, production-ready REST API implementation for an E-Commerce application built with **Node.js, Express, and MongoDB (Mongoose)**, including password hashing (bcrypt) and JWT authentication middleware.

---

### Folder Structure

```text
ecommerce-api/
├── config/
│   └── db.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── .env
├── server.js
└── package.json

```

---

### 1. `package.json`

```json
{
  "name": "ecommerce-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}

```

---

### 2. Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
JWT_SECRET=super_secret_jwt_key_123

```

---

### 3. Database Connection (`config/db.js`)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

```

---

### 4. Mongoose Models (`models/`)

#### A. User Model (`models/User.js`)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

```

#### B. Product Model (`models/Product.js`)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

```

#### C. Order Model (`models/Order.js`)

```javascript
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

```

---

### 5. Authentication Middleware (`middleware/auth.js`)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

module.exports = { protect, adminOnly };

```

---

### 6. Express Routes & Controllers (`routes/`)

#### A. Auth Routes (`routes/authRoutes.js`)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

```

#### B. Product Routes (`routes/productRoutes.js`)

```javascript
const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/products - Get all products with pagination & filtering
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = category ? { category } : {};

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Admin Only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id - Admin Only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id - Admin Only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

```

#### C. Order Routes (`routes/orderRoutes.js`)

```javascript
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/orders - Create new order
router.post('/', protect, async (req, res) => {
  const { orderItems } = req.body; // Expects [{ product: "id", quantity: 2 }]

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  try {
    let totalAmount = 0;
    const populatedItems = [];

    // Verify stock and compute total amount
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${dbProduct.name}` });
      }

      // Deduct stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();

      totalAmount += dbProduct.price * item.quantity;
      populatedItems.push({
        product: dbProduct._id,
        quantity: item.quantity,
        price: dbProduct.price
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: populatedItems,
      totalAmount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/my-orders - Get logged-in user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

```

---

### 7. Main Application Entry Point (`server.js`)

```javascript
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`E-Commerce Server running on port ${PORT}`);
});

```

---

### Summary of API Endpoints

| Method     | Endpoint                | Access   | Description                                     |
| ---------- | ----------------------- | -------- | ----------------------------------------------- |
| **POST**   | `/api/auth/register`    | Public   | Register a new user                             |
| **POST**   | `/api/auth/login`       | Public   | Login & receive JWT                             |
| **GET**    | `/api/products`         | Public   | Fetch products (with `?category=` & pagination) |
| **GET**    | `/api/products/:id`     | Public   | Fetch single product details                    |
| **POST**   | `/api/products`         | Admin    | Create a new product                            |
| **PUT**    | `/api/products/:id`     | Admin    | Update product details/stock                    |
| **DELETE** | `/api/products/:id`     | Admin    | Delete a product                                |
| **POST**   | `/api/orders`           | Customer | Place an order (deducts product stock)          |
| **GET**    | `/api/orders/my-orders` | Customer | Fetch current user's order history              |
