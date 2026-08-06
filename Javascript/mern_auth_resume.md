# 🔐 MERN Stack – Auth + JWT + Role-Based Access Control

## 👥 Roles
| Role | Access |
|---|---|
| **Admin** | Manage all users, jobs, resumes |
| **Job Seeker** | Create resume, apply to jobs |
| **Employer** | Post jobs, view applicants |

---

## 📁 Project Structure
```
resume-job-portal/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── jobController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js           ← JWT verify
│   │   ├── authorize.js      ← Role check
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   └── adminRoutes.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── job.test.js
│   │   └── resume.test.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── resumeApi.js
│   │   │   └── jobApi.js
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── Login.test.jsx
│   │   │   │   └── Register.test.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminDashboard/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminDashboard.test.jsx
│   │   │   ├── JobBoard/
│   │   │   │   ├── JobBoard.jsx
│   │   │   │   └── JobBoard.test.jsx
│   │   │   └── JobPost/
│   │   │       ├── JobPost.jsx
│   │   │       └── JobPost.test.jsx
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   ├── authSlice.js
│   │   │   ├── authSlice.test.js
│   │   │   ├── resumeSlice.js
│   │   │   └── jobSlice.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── e2e/
│       ├── auth.spec.js
│       ├── jobseeker.spec.js
│       ├── employer.spec.js
│       └── admin.spec.js
```

---

## 🔧 BACKEND

### `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_job_portal
JWT_SECRET=super_secret_jwt_key_2025
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=super_refresh_secret_2025
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
```

### `backend/config/db.js`
```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ DB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### `backend/utils/generateToken.js`
```js
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
```

---

## 📦 MODELS

### `backend/models/User.js`
```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role:     { type: String, enum: ['admin', 'jobseeker', 'employer'], default: 'jobseeker' },
  avatar:   { type: String, default: '' },
  company:  { type: String },          // employer only
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, select: false },
  lastLogin: { type: Date },
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields from JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
```

### `backend/models/Job.js`
```js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['full-time','part-time','contract','remote'], default: 'full-time' },
  salary:      { min: Number, max: Number, currency: { type: String, default: 'INR' } },
  skills:      [{ type: String }],
  experience:  { type: String },
  isActive:    { type: Boolean, default: true },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deadline:    { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
```

### `backend/models/Application.js`
```js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job:      { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume:   { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  status:   { type: String, enum: ['pending','reviewed','shortlisted','rejected','hired'], default: 'pending' },
  coverLetter: { type: String },
  appliedAt:   { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
```

### `backend/models/Resume.js`
```js
const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, default: 'My Resume' },
  template: { type: String, enum: ['modern','dark','minimal','bold'], default: 'modern' },
  header: {
    name: String, title: String, email: String,
    phone: String, location: String, linkedin: String,
  },
  summary:    { type: String },
  skills:     { type: Map, of: [String], default: {} },
  experience: [{
    company: String, position: String, duration: String,
    current: Boolean, description: String, skills: [String],
  }],
  education:  [{ degree: String, institution: String, year: String }],
  awards:     [{ title: String, org: String, desc: String }],
  isPublic:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
```

---

## 🛡️ MIDDLEWARE

### `backend/middleware/auth.js`
```js
const { verifyAccessToken } = require('../utils/generateToken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    if (!req.user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

module.exports = protect;
```

### `backend/middleware/authorize.js`
```js
// Role-based access control
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not authorized to access this route`,
    });
  }
  next();
};

module.exports = authorize;
```

### `backend/middleware/errorHandler.js`
```js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = `Duplicate field: ${Object.keys(err.keyValue).join(', ')} already exists`;
    statusCode = 400;
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join(', ');
    statusCode = 400;
  }
  // JWT errors
  if (err.name === 'JsonWebTokenError') { message = 'Invalid token'; statusCode = 401; }
  if (err.name === 'TokenExpiredError') { message = 'Token expired'; statusCode = 401; }

  res.status(statusCode).json({ success: false, message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
};

module.exports = errorHandler;
```

---

## 🎮 CONTROLLERS

### `backend/controllers/authController.js`
```js
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');

// @desc   Register user
// @route  POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, company } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Only allow admin creation by existing admin
    if (role === 'admin') {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(403).json({ success: false, message: 'Admin creation requires authorization' });
    }

    const user = await User.create({ name, email, password, role: role || 'jobseeker', company });
    const accessToken  = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({ success: true,
      data: { user, accessToken, refreshToken,
        expiresIn: process.env.JWT_EXPIRE } });
  } catch (err) { next(err); }
};

// @desc   Login user
// @route  POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });

    const accessToken  = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true,
      data: { user, accessToken, refreshToken,
        role: user.role, expiresIn: process.env.JWT_EXPIRE } });
  } catch (err) { next(err); }
};

// @desc   Refresh access token
// @route  POST /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const newAccessToken  = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch (err) { next(err); }
};

// @desc   Get current user
// @route  GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

// @desc   Logout
// @route  POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+refreshToken');
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

// @desc   Update password
// @route  PUT /api/auth/password
const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    user.password = req.body.newPassword;
    await user.save();
    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (err) { next(err); }
};

module.exports = { register, login, refreshToken, getMe, logout, updatePassword };
```

### `backend/controllers/jobController.js`
```js
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc   GET all active jobs (public)
// @route  GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    const { search, location, type, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (search)   query.$or = [{ title: /search/i }, { description: /search/i }];
    if (location) query.location = new RegExp(location, 'i');
    if (type)     query.type = type;

    const total = await Job.countDocuments(query);
    const jobs  = await Job.find(query)
      .populate('postedBy', 'name company email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, count: jobs.length, total,
      pages: Math.ceil(total / limit), currentPage: Number(page), data: jobs });
  } catch (err) { next(err); }
};

// @desc   POST create job (employer only)
// @route  POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, data: job });
  } catch (err) { next(err); }
};

// @desc   PUT update job (employer: own jobs only)
// @route  PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) { next(err); }
};

// @desc   DELETE job
// @route  DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (err) { next(err); }
};

// @desc   POST apply to job (jobseeker only)
// @route  POST /api/jobs/:id/apply
const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) return res.status(404).json({ success: false, message: 'Job not found or closed' });
    const existing = await Application.findOne({ job: req.params.id, applicant: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });
    const application = await Application.create({
      job: req.params.id, applicant: req.user._id,
      resume: req.body.resumeId, coverLetter: req.body.coverLetter,
    });
    job.applicants.push(req.user._id);
    await job.save();
    res.status(201).json({ success: true, data: application });
  } catch (err) { next(err); }
};

// @desc   GET applicants for employer's job
// @route  GET /api/jobs/:id/applicants
const getApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const applications = await Application.find({ job: req.params.id })
      .populate('applicant', 'name email avatar')
      .populate('resume', 'title header summary');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) { next(err); }
};

// @desc   PUT update application status (employer)
// @route  PUT /api/jobs/:id/applicants/:appId
const updateApplicationStatus = async (req, res, next) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.appId, { status: req.body.status }, { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.status(200).json({ success: true, data: app });
  } catch (err) { next(err); }
};

module.exports = { getJobs, createJob, updateJob, deleteJob, applyToJob, getApplicants, updateApplicationStatus };
```

### `backend/controllers/adminController.js`
```js
const User = require('../models/User');
const Job  = require('../models/Job');
const Resume = require('../models/Resume');
const Application = require('../models/Application');

// @desc   GET dashboard stats
// @route  GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [users, jobs, resumes, applications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Resume.countDocuments(),
      Application.countDocuments(),
    ]);
    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, data: { users, jobs, resumes, applications, byRole } });
  } catch (err) { next(err); }
};

// @desc   GET all users
// @route  GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

// @desc   PUT activate/deactivate user
// @route  PUT /api/admin/users/:id/toggle
const toggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) { next(err); }
};

// @desc   PUT change user role
// @route  PUT /api/admin/users/:id/role
const changeRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @desc   DELETE user
// @route  DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

module.exports = { getStats, getUsers, toggleUser, changeRole, deleteUser };
```

---

## 🛣️ ROUTES

### `backend/routes/authRoutes.js`
```js
const express = require('express');
const router = express.Router();
const { register, login, refreshToken, getMe, logout, updatePassword } = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refreshToken);
router.get('/me',        protect, getMe);
router.post('/logout',   protect, logout);
router.put('/password',  protect, updatePassword);

module.exports = router;
```

### `backend/routes/jobRoutes.js`
```js
const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob, applyToJob, getApplicants, updateApplicationStatus } = require('../controllers/jobController');
const protect   = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/',    getJobs);  // public
router.post('/',   protect, authorize('employer', 'admin'), createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);
router.post('/:id/apply',             protect, authorize('jobseeker'), applyToJob);
router.get('/:id/applicants',         protect, authorize('employer', 'admin'), getApplicants);
router.put('/:id/applicants/:appId',  protect, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router;
```

### `backend/routes/adminRoutes.js`
```js
const express = require('express');
const router = express.Router();
const { getStats, getUsers, toggleUser, changeRole, deleteUser } = require('../controllers/adminController');
const protect   = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All admin routes protected + admin only
router.use(protect, authorize('admin'));

router.get('/stats',               getStats);
router.get('/users',               getUsers);
router.put('/users/:id/toggle',    toggleUser);
router.put('/users/:id/role',      changeRole);
router.delete('/users/:id',        deleteUser);

module.exports = router;
```

### `backend/server.js`
```js
const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const dotenv    = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/jobs',    require('./routes/jobRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/admin',   require('./routes/adminRoutes'));

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
module.exports = app;
```

---

## 🧪 BACKEND TESTS

### `backend/tests/auth.test.js`
```js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app  = require('../server');
const User = require('../models/User');

let mongo, token, userId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => { await mongoose.disconnect(); await mongo.stop(); });
afterEach(async () => { await User.deleteMany(); });

const adminUser    = { name:'Admin',     email:'admin@test.com',    password:'pass1234', role:'admin' };
const seekerUser   = { name:'Seeker',    email:'seeker@test.com',   password:'pass1234', role:'jobseeker' };
const employerUser = { name:'Employer',  email:'employer@test.com', password:'pass1234', role:'employer' };

describe('POST /api/auth/register', () => {
  it('should register jobseeker', async () => {
    const res = await request(app).post('/api/auth/register').send(seekerUser);
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('jobseeker');
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });
  it('should register employer', async () => {
    const res = await request(app).post('/api/auth/register').send(employerUser);
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('employer');
  });
  it('should fail on duplicate email', async () => {
    await User.create(seekerUser);
    const res = await request(app).post('/api/auth/register').send(seekerUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });
  it('should fail without email', async () => {
    const res = await request(app).post('/api/auth/register').send({ name:'Test', password:'pass1234' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => { await User.create(seekerUser); });
  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: seekerUser.email, password: seekerUser.password });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.role).toBe('jobseeker');
    token = res.body.data.accessToken;
  });
  it('should fail with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: seekerUser.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
  it('should fail with unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'pass1234' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('should return current user with valid token', async () => {
    const reg = await request(app).post('/api/auth/register').send(seekerUser);
    const t = reg.body.data.accessToken;
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${t}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(seekerUser.email);
  });
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
  it('should return 401 with invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
});
```

### `backend/tests/job.test.js`
```js
const request  = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app  = require('../server');
const User = require('../models/User');
const Job  = require('../models/Job');

let mongo, employerToken, seekerToken, adminToken, jobId;

const mockJob = { title:'React Developer', description:'Build React apps', company:'TechCorp', location:'Pune', type:'full-time', skills:['React JS','TypeScript'] };

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const emp = await request(app).post('/api/auth/register').send({ name:'Emp', email:'emp@t.com', password:'pass1234', role:'employer' });
  employerToken = emp.body.data.accessToken;

  const seek = await request(app).post('/api/auth/register').send({ name:'Seek', email:'seek@t.com', password:'pass1234', role:'jobseeker' });
  seekerToken = seek.body.data.accessToken;

  const adm = await request(app).post('/api/auth/register').send({ name:'Admin', email:'adm@t.com', password:'pass1234', role:'admin' });
  adminToken = adm.body.data.accessToken;
});

afterAll(async () => { await mongoose.disconnect(); await mongo.stop(); });
afterEach(async () => { await Job.deleteMany(); });

describe('POST /api/jobs', () => {
  it('employer can create job', async () => {
    const res = await request(app).post('/api/jobs').set('Authorization', `Bearer ${employerToken}`).send(mockJob);
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('React Developer');
    jobId = res.body.data._id;
  });
  it('jobseeker CANNOT create job', async () => {
    const res = await request(app).post('/api/jobs').set('Authorization', `Bearer ${seekerToken}`).send(mockJob);
    expect(res.status).toBe(403);
  });
  it('unauthenticated CANNOT create job', async () => {
    const res = await request(app).post('/api/jobs').send(mockJob);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/jobs', () => {
  it('anyone can view jobs (public)', async () => {
    await request(app).post('/api/jobs').set('Authorization', `Bearer ${employerToken}`).send(mockJob);
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('POST /api/jobs/:id/apply', () => {
  it('jobseeker can apply', async () => {
    const job = await request(app).post('/api/jobs').set('Authorization', `Bearer ${employerToken}`).send(mockJob);
    const res = await request(app).post(`/api/jobs/${job.body.data._id}/apply`).set('Authorization', `Bearer ${seekerToken}`).send({ coverLetter:'I am a great fit!' });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });
  it('employer CANNOT apply', async () => {
    const job = await request(app).post('/api/jobs').set('Authorization', `Bearer ${employerToken}`).send(mockJob);
    const res = await request(app).post(`/api/jobs/${job.body.data._id}/apply`).set('Authorization', `Bearer ${employerToken}`).send({});
    expect(res.status).toBe(403);
  });
  it('cannot apply twice', async () => {
    const job = await request(app).post('/api/jobs').set('Authorization', `Bearer ${employerToken}`).send(mockJob);
    await request(app).post(`/api/jobs/${job.body.data._id}/apply`).set('Authorization', `Bearer ${seekerToken}`).send({});
    const res = await request(app).post(`/api/jobs/${job.body.data._id}/apply`).set('Authorization', `Bearer ${seekerToken}`).send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already applied/i);
  });
});

describe('Admin routes', () => {
  it('admin can get stats', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.users).toBeDefined();
  });
  it('non-admin CANNOT access admin routes', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${seekerToken}`);
    expect(res.status).toBe(403);
  });
});
```

---

## 🎨 FRONTEND

### `frontend/src/store/authSlice.js`
```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../api/authApi';

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await authAPI.register(data); return res.data.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { const res = await authAPI.login(data); return res.data.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try { await authAPI.logout(); }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { const res = await authAPI.getMe(); return res.data.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    role: localStorage.getItem('role') || null,
    status: 'idle',
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setCredentials: (state, { payload }) => {
      state.user  = payload.user;
      state.token = payload.accessToken;
      state.role  = payload.user?.role;
      state.isAuthenticated = true;
      localStorage.setItem('token',        payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      localStorage.setItem('role',         payload.user?.role);
    },
    clearCredentials: (state) => {
      state.user = null; state.token = null;
      state.role = null; state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,   (s) => { s.status = 'loading'; s.error = null; })
      .addCase(registerUser.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.user   = payload.user;
        s.token  = payload.accessToken;
        s.role   = payload.user?.role;
        s.isAuthenticated = true;
        localStorage.setItem('token',        payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        localStorage.setItem('role',         payload.user?.role);
      })
      .addCase(registerUser.rejected,  (s, { payload }) => { s.status = 'failed'; s.error = payload; })
      .addCase(loginUser.pending,      (s) => { s.status = 'loading'; s.error = null; })
      .addCase(loginUser.fulfilled,    (s, { payload }) => {
        s.status = 'succeeded';
        s.user   = payload.user;
        s.token  = payload.accessToken;
        s.role   = payload.role;
        s.isAuthenticated = true;
        localStorage.setItem('token',        payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        localStorage.setItem('role',         payload.role);
      })
      .addCase(loginUser.rejected,  (s, { payload }) => { s.status = 'failed'; s.error = payload; })
      .addCase(logoutUser.fulfilled,(s) => {
        s.user = null; s.token = null; s.role = null; s.isAuthenticated = false;
        localStorage.clear();
      })
      .addCase(fetchMe.fulfilled, (s, { payload }) => { s.user = payload; });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export const selectAuth   = s => s.auth;
export const selectUser   = s => s.auth.user;
export const selectRole   = s => s.auth.role;
export const selectIsAuth = s => s.auth.isAuthenticated;
export default authSlice.reducer;
```

### `frontend/src/store/authSlice.test.js`
```js
import authReducer, { clearError, clearCredentials, loginUser, registerUser } from './authSlice';

const initialState = authReducer(undefined, { type: '@@INIT' });

describe('authSlice reducers', () => {
  it('should clear error', () => {
    const state = authReducer({ ...initialState, error: 'some error' }, clearError());
    expect(state.error).toBeNull();
  });
  it('should clear credentials', () => {
    const loaded = { ...initialState, user: { name: 'Test' }, token: 'abc', isAuthenticated: true };
    const state = authReducer(loaded, clearCredentials());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('authSlice async thunks', () => {
  it('loginUser.pending sets loading', () => {
    const state = authReducer(initialState, { type: loginUser.pending.type });
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });
  it('loginUser.rejected sets error', () => {
    const state = authReducer(initialState, { type: loginUser.rejected.type, payload: 'Invalid credentials' });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid credentials');
  });
  it('loginUser.fulfilled sets user and token', () => {
    const payload = { user: { _id: '1', name: 'Test', role: 'jobseeker' }, accessToken: 'jwt123', refreshToken: 'ref123', role: 'jobseeker' };
    const state = authReducer(initialState, { type: loginUser.fulfilled.type, payload });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.name).toBe('Test');
    expect(state.token).toBe('jwt123');
    expect(state.role).toBe('jobseeker');
  });
  it('registerUser.fulfilled sets user', () => {
    const payload = { user: { _id: '2', name: 'New', role: 'employer' }, accessToken: 'jwt456', refreshToken: 'ref456' };
    const state = authReducer(initialState, { type: registerUser.fulfilled.type, payload });
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe('employer');
  });
});
```

### `frontend/src/api/authApi.js`
```js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefresh);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch { localStorage.clear(); window.location.href = '/login'; }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data)   => api.post('/auth/register', data),
  login:    (data)   => api.post('/auth/login', data),
  logout:   ()       => api.post('/auth/logout'),
  getMe:    ()       => api.get('/auth/me'),
  refresh:  (token)  => api.post('/auth/refresh', { refreshToken: token }),
  updatePassword: (data) => api.put('/auth/password', data),
};

export default api;
```

### `frontend/src/components/Auth/Login.jsx`
```jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuth } from '../../store/authSlice';

export default function Login({ onSuccess }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector(selectAuth);
  const [form, setForm] = useState({ email:'', password:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === 'fulfilled') onSuccess?.(res.payload.role);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form" style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:360, margin:'0 auto', padding:24 }}>
      <h2 style={{ margin:0, color:'#1e293b' }}>Sign In</h2>
      {error && <div data-testid="error-msg" style={{ padding:'8px 12px', background:'#fee2e2', color:'#b91c1c', borderRadius:8, fontSize:13 }}>{error}</div>}
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:'#6b7280' }}>EMAIL</label>
        <input data-testid="email-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
          style={{ display:'block', width:'100%', padding:'8px 10px', borderRadius:7, border:'1px solid #d1d5db', marginTop:4, fontSize:13 }}/>
      </div>
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:'#6b7280' }}>PASSWORD</label>
        <input data-testid="password-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
          style={{ display:'block', width:'100%', padding:'8px 10px', borderRadius:7, border:'1px solid #d1d5db', marginTop:4, fontSize:13 }}/>
      </div>
      <button data-testid="login-btn" type="submit" disabled={status==='loading'}
        style={{ padding:'10px', borderRadius:8, border:'none', background:'#6366f1', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:700 }}>
        {status==='loading' ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
```

### `frontend/src/components/Auth/Login.test.jsx`
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import Login from './Login';

jest.mock('../../api/authApi', () => ({
  authAPI: {
    login: jest.fn(),
  },
}));

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Provider store={makeStore()}><Login/></Provider>);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
  });

  it('updates email input', () => {
    render(<Provider store={makeStore()}><Login/></Provider>);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } });
    expect(screen.getByTestId('email-input')).toHaveValue('test@test.com');
  });

  it('updates password input', () => {
    render(<Provider store={makeStore()}><Login/></Provider>);
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'pass1234' } });
    expect(screen.getByTestId('password-input')).toHaveValue('pass1234');
  });

  it('shows error on failed login', async () => {
    const { authAPI } = require('../../api/authApi');
    authAPI.login.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
    render(<Provider store={makeStore()}><Login/></Provider>);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('login-btn'));
    await waitFor(() => expect(screen.getByTestId('error-msg')).toBeInTheDocument());
  });

  it('disables button while loading', async () => {
    render(<Provider store={makeStore()}><Login/></Provider>);
    fireEvent.click(screen.getByTestId('login-btn'));
    // Button text changes or disabled during loading
    expect(screen.getByTestId('login-btn')).toBeTruthy();
  });
});
```

### `frontend/src/components/ProtectedRoute.jsx`
```jsx
import { useSelector } from 'react-redux';
import { selectIsAuth, selectRole } from '../store/authSlice';

export default function ProtectedRoute({ children, roles }) {
  const isAuth = useSelector(selectIsAuth);
  const role   = useSelector(selectRole);

  if (!isAuth) return (
    <div style={{ textAlign:'center', padding:40 }}>
      <h3>🔒 Please log in to continue</h3>
      <a href="/login" style={{ color:'#6366f1' }}>Go to Login</a>
    </div>
  );

  if (roles && !roles.includes(role)) return (
    <div style={{ textAlign:'center', padding:40 }}>
      <h3>⛔ Access Denied</h3>
      <p>Your role <strong>{role}</strong> does not have permission to view this page.</p>
    </div>
  );

  return children;
}
```

---

## 🎭 PLAYWRIGHT E2E TESTS

### `frontend/e2e/auth.spec.js`
```js
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('should login as jobseeker', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('seeker@test.com');
    await page.getByTestId('password-input').fill('pass1234');
    await page.getByTestId('login-btn').click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/job seeker/i)).toBeVisible();
  });

  test('should login as employer', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('employer@test.com');
    await page.getByTestId('password-input').fill('pass1234');
    await page.getByTestId('login-btn').click();
    await expect(page).toHaveURL('/employer/dashboard');
    await expect(page.getByText(/post a job/i)).toBeVisible();
  });

  test('should login as admin', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@test.com');
    await page.getByTestId('password-input').fill('pass1234');
    await page.getByTestId('login-btn').click();
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText(/admin dashboard/i)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('wrong@test.com');
    await page.getByTestId('password-input').fill('wrongpass');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('error-msg')).toBeVisible();
    await expect(page.getByTestId('error-msg')).toContainText(/invalid/i);
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('seeker@test.com');
    await page.getByTestId('password-input').fill('pass1234');
    await page.getByTestId('login-btn').click();
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL('/login');
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });

  test('should redirect unauthenticated to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });
});
```

### `frontend/e2e/employer.spec.js`
```js
import { test, expect } from '@playwright/test';

test.describe('Employer – Job Posting Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Login as employer
    await page.goto('/login');
    await page.getByTestId('email-input').fill('employer@test.com');
    await page.getByTestId('password-input').fill('pass1234');
    await page.getByTestId('login-btn').click();
    await page.waitForURL('/employer/dashboard');
  });

  test('should see employer dashboard', async ({ page }) => {
    await expect(page.getByText(/employer dashboard/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /post a job/i })).toBeVisible();
  });

  test('should post a new job', async ({ page }) => {
    await page.getByRole('button', { name: /post a job/i }).click();
    await page.getByLabel(/job title/i).fill('Senior React Developer');
    await page.getByLabel(/description/i).fill('We need a React expert');
    await page.getByLabel(/location/i).fill('Pune, India');
    await page.getByLabel(/type/i).selectOption('full-time');
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/jobs') && r.request().method() === 'POST'),
      page.getByRole('button', { name: /publish job/i }).click(),
    ]);
    expect(response.status()).toBe(201);
    await expect(page.getByText('Senior React Developer')).toBeVisible();
  });

  test('should view applicants', async ({ page }) => {
    await page.getByText(/view applicants/i).first().click();
    await expect(page.getByText(/applicants/i)).toBeVisible();
  });

  test('should NOT access admin panel', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText(/access denied/i)).toBeVisible();
  });

  test('should update application status', async ({ page }) => {
    await page.getByText(/view applicants/i).first().click();
    await page.getByRole('button', { name: /shortlist/i }).first().click();
    await expect(page.getByText(/shortlisted/i)).toBeVisible();
  });
});
```

### `frontend/e2e/jobseeker.spec.js`
```js
import { test, expect } from '@playwright/test';

test.describe('Job Seeker Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('seeker@test.com');
    await page.getByTestId('password-input').fill('pass1234');
    await page.getByTestId('login-btn').click();
    await page.waitForURL('/dashboard');
  });

  test('should see job seeker dashboard', async ({ page }) => {
    await expect(page.getByText(/job seeker dashboard/i)).toBeVisible();
    await expect(page.getByText(/browse jobs/i)).toBeVisible();
    await expect(page.getByText(/my resume/i)).toBeVisible();
  });

  test('should browse jobs', async ({ page }) => {
    await page.getByText(/browse jobs/i).click();
    await expect(page.getByTestId('job-list')).toBeVisible();
  });

  test('should apply to a job', async ({ page }) => {
    await page.goto('/jobs');
    await page.getByRole('button', { name: /apply/i }).first().click();
    await page.getByLabel(/cover letter/i).fill('I am the perfect candidate!');
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/apply') && r.request().method() === 'POST'),
      page.getByRole('button', { name: /submit application/i }).click(),
    ]);
    expect(response.status()).toBe(201);
    await expect(page.getByText(/application submitted/i)).toBeVisible();
  });

  test('should NOT post a job', async ({ page }) => {
    await page.goto('/employer/post-job');
    await expect(page.getByText(/access denied/i)).toBeVisible();
  });

  test('should create and view resume', async ({ page }) => {
    await page.getByText(/my resume/i).click();
    await expect(page.getByText(/resume builder/i)).toBeVisible();
    await page.getByLabel(/full name/i).fill('Test Seeker');
    await expect(page.getByText('Test Seeker')).toBeVisible();
  });
});
```

### `frontend/e2e/admin.spec.js`
```js
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@test.com');
    await page.getByTestId('password-input').fill('pass1234');
    await page.getByTestId('login-btn').click();
    await page.waitForURL('/admin');
  });

  test('should see admin dashboard with stats', async ({ page }) => {
    await expect(page.getByText(/admin dashboard/i)).toBeVisible();
    await expect(page.getByText(/total users/i)).toBeVisible();
    await expect(page.getByText(/total jobs/i)).toBeVisible();
    await expect(page.getByText(/total resumes/i)).toBeVisible();
  });

  test('should view all users', async ({ page }) => {
    await page.getByRole('tab', { name: /users/i }).click();
    await expect(page.getByTestId('users-table')).toBeVisible();
  });

  test('should deactivate a user', async ({ page }) => {
    await page.getByRole('tab', { name: /users/i }).click();
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/toggle') && r.request().method() === 'PUT'),
      page.getByRole('button', { name: /deactivate/i }).first().click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test('should change user role', async ({ page }) => {
    await page.getByRole('tab', { name: /users/i }).click();
    await page.getByRole('button', { name: /change role/i }).first().click();
    await page.getByRole('option', { name: /employer/i }).click();
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/role') && r.request().method() === 'PUT'),
      page.getByRole('button', { name: /confirm/i }).click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test('should delete a job', async ({ page }) => {
    await page.getByRole('tab', { name: /jobs/i }).click();
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/jobs/') && r.request().method() === 'DELETE'),
      page.getByRole('button', { name: /delete/i }).first().click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test('admin can access all pages', async ({ page }) => {
    for (const path of ['/admin', '/jobs', '/employer/dashboard']) {
      await page.goto(path);
      await expect(page.getByText(/access denied/i)).not.toBeVisible();
    }
  });
});
```

---

## 📊 Role-Based Access Matrix

| Route | Admin | Employer | Job Seeker | Public |
|---|---|---|---|---|
| `GET /api/jobs` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/jobs` | ✅ | ✅ | ❌ | ❌ |
| `PUT /api/jobs/:id` | ✅ | ✅ (own) | ❌ | ❌ |
| `DELETE /api/jobs/:id` | ✅ | ✅ (own) | ❌ | ❌ |
| `POST /api/jobs/:id/apply` | ❌ | ❌ | ✅ | ❌ |
| `GET /api/jobs/:id/applicants` | ✅ | ✅ (own) | ❌ | ❌ |
| `GET /api/admin/*` | ✅ | ❌ | ❌ | ❌ |
| `GET /api/auth/me` | ✅ | ✅ | ✅ | ❌ |
| `POST /api/resumes` | ✅ | ❌ | ✅ | ❌ |

---

## 🚀 Setup & Run

```bash
# Backend
cd backend && npm install
cp .env.example .env   # add your MONGO_URI
npm run dev            # :5000

# Frontend
cd frontend && npm install
npm run dev            # :5173
npm test               # Jest unit tests
npm run test:e2e       # Playwright E2E

# Run all backend tests
cd backend && npm test
```
