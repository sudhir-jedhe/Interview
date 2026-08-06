const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const { validateBook } = require('./validators');
const { authenticateToken, authorizeRole } = require('./auth');
const { errorHandler } = require('./errorHandler');
const { cacheMiddleware } = require('./cache');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API versioning
const v1Router = express.Router();

// Mock database
let books = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: 2, title: '1984', author: 'George Orwell' },
];

// Routes
v1Router.get('/books', cacheMiddleware(300), (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < books.length) {
    results.next = {
      page: page + 1,
      limit: limit
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    };
  }

  // Filtering
  let filteredBooks = books;
  if (req.query.author) {
    filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(req.query.author.toLowerCase()));
  }

  results.results = filteredBooks.slice(startIndex, endIndex);
  res.status(200).json(results);
});

v1Router.get('/books/:id', cacheMiddleware(300), (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

v1Router.post('/books', authenticateToken, authorizeRole('admin'), validateBook, (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

v1Router.put('/books/:id', authenticateToken, authorizeRole('admin'), validateBook, (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index !== -1) {
    books[index] = { ...books[index], ...req.body };
    res.status(200).json(books[index]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

v1Router.delete('/books/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index !== -1) {
    books.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Use versioned routes
app.use('/api/v1', v1Router);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

