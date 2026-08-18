Here is a complete, production-ready implementation of **Authentication and Role-Based Access Control (RBAC)** using Node.js, Express, MongoDB (Mongoose), `bcryptjs`, and JSON Web Tokens (`jsonwebtoken`).

---

### File Structure

```text
server/
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── adminRoutes.js
├── .env
└── server.js

```

---

### 1. User Model (`models/User.js`)

Handles password hashing via `bcryptjs` hooks and exposes a method to verify credentials.

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// Pre-save hook to hash password before persisting
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method to compare passwords during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

```

---

### 2. Authentication & RBAC Middleware (`middleware/authMiddleware.js`)

Handles JWT validation and role-based access checks.

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - validates JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user object (excluding password) to request
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Role-Based Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user?.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

```

---

### 3. Authentication Routes (`routes/authRoutes.js`)

Handles registration and login operations.

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

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
    if (user && (await user.comparePassword(password))) {
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

// GET /api/auth/me (Protected Route)
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;

```

---

### 4. Role-Protected Routes (`routes/adminRoutes.js`)

Exposes endpoints accessible only by specific roles.

```javascript
const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Accessible by editor & admin
router.get('/dashboard', protect, authorize('editor', 'admin'), (req, res) => {
  res.json({ message: `Welcome to the Dashboard, ${req.user.name}` });
});

// Accessible strictly by admin only
router.get('/users', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin Access: Managing user directory...' });
});

module.exports = router;

```

---

### 5. Server Setup (`server.js`)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_demo')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Failed:', err));

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```
