Here is a complete, production-ready CRUD API setup built with **Node.js, Express, MongoDB (Mongoose)**, featuring explicit request validation using **Zod**, centralized error handling middleware, and standard pagination.

---

### Folder Structure

```text
crud-api/
├── middleware/
│   ├── validate.js
│   └── errorHandler.js
├── models/
│   └── Item.js
├── routes/
│   └── itemRoutes.js
├── schemas/
│   └── itemSchema.js
├── .env
├── server.js
└── package.json

```

---

### 1. `package.json`

```json
{
  "name": "crud-api-express",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-async-errors": "^3.1.1",
    "mongoose": "^8.3.1",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}

```

---

### 2. Mongoose Schema (`models/Item.js`)

```javascript
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);

```

---

### 3. Zod Request Validation Schema (`schemas/itemSchema.js`)

```javascript
const { z } = require('zod');

// Schema for Creating an Item
const createItemSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    description: z.string({ required_error: 'Description is required' }),
    price: z.number({ required_error: 'Price is required' }).positive('Price must be greater than 0'),
    category: z.string({ required_error: 'Category is required' }),
    inStock: z.boolean().optional()
  })
});

// Schema for Updating an Item (All fields optional)
const updateItemSchema = z.object({
  body: createItemSchema.shape.body.partial()
});

module.exports = { createItemSchema, updateItemSchema };

```

---

### 4. Validation & Error Middleware (`middleware/`)

#### A. Request Validator (`middleware/validate.js`)

```javascript
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    next(error); // Passes ZodError directly to global error handler
  }
};

module.exports = validate;

```

#### B. Centralized Global Error Handler (`middleware/errorHandler.js`)

```javascript
const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.').replace('body.', ''),
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: formattedErrors
    });
  }

  // 2. Mongoose Cast Error (Invalid Mongo ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid resource ID format: ${err.value}`
    });
  }

  // 3. General Fallback Server Error
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;

```

---

### 5. CRUD Routes with Pagination (`routes/itemRoutes.js`)

```javascript
const express = require('express');
const Item = require('../models/Item');
const validate = require('../middleware/validate');
const { createItemSchema, updateItemSchema } = require('../schemas/itemSchema');

const router = express.Router();

// 1. CREATE: POST /api/items
router.post('/', validate(createItemSchema), async (req, res) => {
  const item = await Item.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// 2. READ ALL (Paginated + Filtered): GET /api/items?page=1&limit=10&category=electronics
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category;

  const query = category ? { category } : {};

  const [items, totalItems] = await Promise.all([
    Item.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Item.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  res.json({
    success: true,
    data: items,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// 3. READ ONE: GET /api/items/:id
router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }
  res.json({ success: true, data: item });
});

// 4. UPDATE: PUT /api/items/:id
router.put('/:id', validate(updateItemSchema), async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  res.json({ success: true, data: item });
});

// 5. DELETE: DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  res.json({ success: true, message: 'Item deleted successfully' });
});

module.exports = router;

```

---

### 6. Express Server Entry Point (`server.js`)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('express-async-errors'); // Eliminates need for manual try/catch blocks in routes

const itemRoutes = require('./routes/itemRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use(express.json());

// API Routes
app.use('/api/items', itemRoutes);

// Global 404 Route
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global Error Handler (Must be registered last)
app.use(errorHandler);

// Database Connection & Server Startup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crud_db';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

```
