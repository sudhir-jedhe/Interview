# 🚀 MERN Stack Resume Builder – Complete Project

## 📁 Project Structure

```
resume-builder/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── resumeController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Resume.js
│   ├── routes/
│   │   └── resumeRoutes.js
│   ├── tests/
│   │   ├── resume.test.js
│   │   └── resumeController.test.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── resumeApi.js
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Header.test.jsx
│   │   │   ├── ResumePreview/
│   │   │   │   ├── ResumePreview.jsx
│   │   │   │   └── ResumePreview.test.jsx
│   │   │   ├── SkillsPanel/
│   │   │   │   ├── SkillsPanel.jsx
│   │   │   │   └── SkillsPanel.test.jsx
│   │   │   └── ExperiencePanel/
│   │   │       ├── ExperiencePanel.jsx
│   │   │       └── ExperiencePanel.test.jsx
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   ├── resumeSlice.js
│   │   │   └── resumeSlice.test.js
│   │   ├── hooks/
│   │   │   └── useResume.js
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   └── main.jsx
│   ├── e2e/
│   │   ├── resume.spec.js
│   │   ├── skills.spec.js
│   │   └── api.spec.js
│   ├── playwright.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🔧 BACKEND

### `backend/package.json`

```json
{
  "name": "resume-builder-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "nodemon": "^3.0.1",
    "supertest": "^6.3.3",
    "mongodb-memory-server": "^8.13.0"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterFramework": ["./tests/setup.js"]
  }
}
```

### `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_builder
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### `backend/config/db.js`

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### `backend/models/Resume.js`

```js
const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String, required: true },
  current: { type: Boolean, default: false },
  description: { type: String, default: "" },
  skills: [{ type: String }],
});

const AwardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  org: { type: String },
  desc: { type: String },
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String },
});

const ResumeSchema = new mongoose.Schema(
  {
    title: { type: String, default: "My Resume" },
    template: {
      type: String,
      enum: ["modern", "dark", "minimal", "bold"],
      default: "modern",
    },
    header: {
      name: { type: String, required: true },
      title: { type: String },
      email: { type: String, required: true },
      phone: { type: String },
      location: { type: String },
      linkedin: { type: String },
    },
    summary: { type: String, default: "" },
    skills: { type: Map, of: [String], default: {} },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    awards: [AwardSchema],
    sections: [
      {
        id: String,
        label: String,
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: false },
      },
    ],
    userId: { type: String, default: "guest" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resume", ResumeSchema);
```

### `backend/controllers/resumeController.js`

```js
const Resume = require("../models/Resume");
const { validationResult } = require("express-validator");

// @desc   GET all resumes
// @route  GET /api/resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res
      .status(200)
      .json({ success: true, count: resumes.length, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   GET single resume
// @route  GET /api/resumes/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   POST create resume
// @route  POST /api/resumes
const createResume = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const resume = await Resume.create(req.body);
    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   PUT update resume
// @route  PUT /api/resumes/:id
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   DELETE resume
// @route  DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    res
      .status(200)
      .json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
```

### `backend/routes/resumeRoutes.js`

```js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

const validateResume = [
  body("header.name").notEmpty().withMessage("Name is required"),
  body("header.email").isEmail().withMessage("Valid email required"),
];

router.route("/").get(getResumes).post(validateResume, createResume);
router.route("/:id").get(getResumeById).put(updateResume).delete(deleteResume);

module.exports = router;
```

### `backend/middleware/errorHandler.js`

```js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
```

### `backend/server.js`

```js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/resumes", resumeRoutes);

// Health check
app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() }),
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
```

---

### `backend/tests/resume.test.js` — Supertest Integration Tests

```js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Resume = require("../models/Resume");

let mongoServer;

const mockResume = {
  title: "Test Resume",
  template: "modern",
  header: {
    name: "Sudhir Jedhe",
    email: "test@test.com",
    phone: "9999999999",
    location: "India",
  },
  summary: "Test summary",
  skills: { Frontend: ["React JS", "TypeScript"] },
  experience: [
    {
      company: "Persistent Systems",
      position: "Project Lead",
      duration: "Jan 2025 – Present",
      current: true,
      description: "Led projects.",
    },
  ],
  education: [
    {
      degree: "BE Computer Engineering",
      institution: "Pune University",
      year: "2012",
    },
  ],
  awards: [{ title: "2x Spot Award", org: "MITR", desc: "On time delivery" }],
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Resume.deleteMany();
});

describe("GET /api/resumes", () => {
  it("should return empty array when no resumes", async () => {
    const res = await request(app).get("/api/resumes");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it("should return all resumes", async () => {
    await Resume.create(mockResume);
    const res = await request(app).get("/api/resumes");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Test Resume");
  });
});

describe("POST /api/resumes", () => {
  it("should create a new resume", async () => {
    const res = await request(app).post("/api/resumes").send(mockResume);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.header.name).toBe("Sudhir Jedhe");
  });

  it("should return 400 if name is missing", async () => {
    const invalid = { ...mockResume, header: { email: "test@test.com" } };
    const res = await request(app).post("/api/resumes").send(invalid);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if email is invalid", async () => {
    const invalid = {
      ...mockResume,
      header: { ...mockResume.header, email: "not-an-email" },
    };
    const res = await request(app).post("/api/resumes").send(invalid);
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/resumes/:id", () => {
  it("should return resume by id", async () => {
    const created = await Resume.create(mockResume);
    const res = await request(app).get(`/api/resumes/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(created._id.toString());
  });

  it("should return 404 for invalid id", async () => {
    const res = await request(app).get("/api/resumes/64a1234567890abcdef12345");
    expect(res.statusCode).toBe(404);
  });
});

describe("PUT /api/resumes/:id", () => {
  it("should update resume", async () => {
    const created = await Resume.create(mockResume);
    const res = await request(app)
      .put(`/api/resumes/${created._id}`)
      .send({ title: "Updated Resume" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated Resume");
  });
});

describe("DELETE /api/resumes/:id", () => {
  it("should delete resume", async () => {
    const created = await Resume.create(mockResume);
    const res = await request(app).delete(`/api/resumes/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Resume deleted successfully");
    const check = await Resume.findById(created._id);
    expect(check).toBeNull();
  });
});
```

### `backend/tests/resumeController.test.js` — Unit Tests

```js
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const Resume = require("../models/Resume");

jest.mock("../models/Resume");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("resumeController - getResumes", () => {
  it("should return all resumes", async () => {
    const resumes = [{ title: "Resume 1" }, { title: "Resume 2" }];
    Resume.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(resumes) });
    const req = {};
    const res = mockRes();
    await getResumes(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: resumes,
    });
  });

  it("should handle errors", async () => {
    Resume.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("DB Error")),
    });
    const res = mockRes();
    await getResumes({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("resumeController - createResume", () => {
  it("should create and return resume", async () => {
    const body = {
      title: "New Resume",
      header: { name: "Sudhir", email: "test@test.com" },
    };
    Resume.create.mockResolvedValue({ _id: "123", ...body });
    const req = {
      body,
      validationResult: jest.fn().mockReturnValue({ isEmpty: () => true }),
    };
    const res = mockRes();
    // mock express-validator
    jest.mock("express-validator", () => ({
      validationResult: () => ({ isEmpty: () => true, array: () => [] }),
    }));
    await createResume(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

---

## 🎨 FRONTEND

### `frontend/package.json`

```json
{
  "name": "resume-builder-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.36.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@vitejs/plugin-react": "^4.0.3",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "vite": "^4.4.5"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterFramework": ["@testing-library/jest-dom"],
    "moduleNameMapper": { "\\.(css|scss)$": "identity-obj-proxy" },
    "transform": { "^.+\\.(js|jsx)$": "babel-jest" }
  }
}
```

### `frontend/src/api/resumeApi.js`

```js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use((config) => {
  console.log(`➡️  ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data?.message);
    return Promise.reject(err);
  },
);

export const resumeAPI = {
  getAll: () => api.get("/resumes"),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post("/resumes", data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
};

export default api;
```

### `frontend/src/store/resumeSlice.js`

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resumeAPI } from "../api/resumeApi";

// ── Async Thunks ──────────────────────────────────────────────────────────────
export const fetchResumes = createAsyncThunk(
  "resume/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await resumeAPI.getAll();
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

export const fetchResumeById = createAsyncThunk(
  "resume/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await resumeAPI.getById(id);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

export const saveResume = createAsyncThunk(
  "resume/save",
  async (data, { rejectWithValue }) => {
    try {
      const res = data._id
        ? await resumeAPI.update(data._id, data)
        : await resumeAPI.create(data);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

export const deleteResume = createAsyncThunk(
  "resume/delete",
  async (id, { rejectWithValue }) => {
    try {
      await resumeAPI.delete(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

// ── Initial State ─────────────────────────────────────────────────────────────
const SECTION_CONFIG = [
  { id: "header", label: "Header", enabled: true, required: true },
  { id: "summary", label: "Summary", enabled: true, required: false },
  { id: "skills", label: "Skills", enabled: true, required: false },
  { id: "experience", label: "Experience", enabled: true, required: false },
  { id: "education", label: "Education", enabled: true, required: false },
  { id: "awards", label: "Awards", enabled: true, required: false },
];

const initialState = {
  current: {
    _id: null,
    title: "My Resume",
    template: "modern",
    sections: SECTION_CONFIG,
    header: {
      name: "Sudhir A. Jedhe",
      title: "Senior React JS Developer | Project Lead",
      email: "jedhesudhir@gmail.com",
      phone: "8551873835",
      location: "India",
      linkedin: "linkedin.com/in/sudhirjedhe",
    },
    summary:
      "Senior React JS Developer with 10+ years of experience building scalable web applications.",
    skills: {
      Frontend: [
        "React JS",
        "TypeScript",
        "JavaScript",
        "HTML5",
        "CSS3",
        "SASS",
        "Next JS",
      ],
      "State Mgmt": ["Redux", "Redux-Toolkit", "Context API", "React Hooks"],
      Automation: ["Playwright", "Selenium", "Cypress", "Puppeteer"],
      Testing: ["Jest", "React Testing Library", "Enzyme", "Storybook"],
      Backend: ["Node JS", "Express JS", "MongoDB", "REST APIs", "JWT"],
    },
    experience: [
      {
        id: 1,
        company: "Persistent Systems",
        position: "Project Lead",
        duration: "Jan 2025 – Till Date",
        current: true,
        description:
          "Led teams for Microsoft and Intuit. Built Playwright automation and snapshot testing framework.",
      },
      {
        id: 2,
        company: "HSBC Technology India",
        position: "Consultant Specialist",
        duration: "Feb 2023 – Dec 2023",
        current: false,
        description:
          "Built CCAT platform with global UI library and RESTful APIs.",
      },
    ],
    education: [
      {
        id: 1,
        degree: "BE Computer Engineering",
        institution: "University of Pune",
        year: "2012",
      },
    ],
    awards: [
      {
        id: 1,
        title: "2x Spot Award",
        org: "MITR Learning Media",
        desc: "On time delivery",
      },
      {
        id: 2,
        title: "Team of Month",
        org: "Hurix Digital",
        desc: "Outstanding contribution",
      },
    ],
  },
  list: [],
  status: "idle", // idle | loading | succeeded | failed
  saveStatus: "idle",
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setTemplate: (state, { payload }) => {
      state.current.template = payload;
    },
    setTitle: (state, { payload }) => {
      state.current.title = payload;
    },
    updateHeader: (state, { payload: { key, value } }) => {
      state.current.header[key] = value;
    },
    updateSummary: (state, { payload }) => {
      state.current.summary = payload;
    },
    toggleSection: (state, { payload }) => {
      state.current.sections = state.current.sections.map((s) =>
        s.id === payload && !s.required ? { ...s, enabled: !s.enabled } : s,
      );
    },
    toggleSkill: (state, { payload: { category, skill } }) => {
      const curr = state.current.skills[category] || [];
      state.current.skills[category] = curr.includes(skill)
        ? curr.filter((s) => s !== skill)
        : [...curr, skill];
    },
    addExperience: (state) => {
      state.current.experience.push({
        id: Date.now(),
        company: "",
        position: "",
        duration: "",
        current: false,
        description: "",
      });
    },
    updateExperience: (state, { payload: { id, key, value } }) => {
      const exp = state.current.experience.find((e) => e.id === id);
      if (exp) exp[key] = value;
    },
    removeExperience: (state, { payload }) => {
      state.current.experience = state.current.experience.filter(
        (e) => e.id !== payload,
      );
    },
    addAward: (state) => {
      state.current.awards.push({
        id: Date.now(),
        title: "",
        org: "",
        desc: "",
      });
    },
    updateAward: (state, { payload: { id, key, value } }) => {
      const award = state.current.awards.find((a) => a.id === id);
      if (award) award[key] = value;
    },
    removeAward: (state, { payload }) => {
      state.current.awards = state.current.awards.filter(
        (a) => a.id !== payload,
      );
    },
    loadResume: (state, { payload }) => {
      state.current = payload;
    },
    resetResume: (state) => {
      state.current = { ...initialState.current, _id: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchResumes.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.list = payload;
      })
      .addCase(fetchResumes.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })
      .addCase(fetchResumeById.fulfilled, (state, { payload }) => {
        state.current = payload;
      })
      .addCase(saveResume.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(saveResume.fulfilled, (state, { payload }) => {
        state.saveStatus = "succeeded";
        state.current._id = payload._id;
      })
      .addCase(saveResume.rejected, (state, { payload }) => {
        state.saveStatus = "failed";
        state.error = payload;
      })
      .addCase(deleteResume.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((r) => r._id !== payload);
      });
  },
});

export const {
  setTemplate,
  setTitle,
  updateHeader,
  updateSummary,
  toggleSection,
  toggleSkill,
  addExperience,
  updateExperience,
  removeExperience,
  addAward,
  updateAward,
  removeAward,
  loadResume,
  resetResume,
} = resumeSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCurrent = (state) => state.resume.current;
export const selectList = (state) => state.resume.list;
export const selectStatus = (state) => state.resume.status;
export const selectSaveStatus = (state) => state.resume.saveStatus;

export default resumeSlice.reducer;
```

### `frontend/src/store/index.js`

```js
import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./resumeSlice";

const store = configureStore({
  reducer: { resume: resumeReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
```

### `frontend/src/store/resumeSlice.test.js` — Redux Unit Tests

```js
import resumeReducer, {
  setTemplate,
  setTitle,
  updateHeader,
  updateSummary,
  toggleSection,
  toggleSkill,
  addExperience,
  updateExperience,
  removeExperience,
  addAward,
  removeAward,
  resetResume,
} from "./resumeSlice";

const initialState = resumeReducer(undefined, { type: "@@INIT" });

describe("resumeSlice reducers", () => {
  describe("setTemplate", () => {
    it("should update template", () => {
      const state = resumeReducer(initialState, setTemplate("dark"));
      expect(state.current.template).toBe("dark");
    });
  });

  describe("setTitle", () => {
    it("should update title", () => {
      const state = resumeReducer(initialState, setTitle("My New Resume"));
      expect(state.current.title).toBe("My New Resume");
    });
  });

  describe("updateHeader", () => {
    it("should update header field", () => {
      const state = resumeReducer(
        initialState,
        updateHeader({ key: "name", value: "John Doe" }),
      );
      expect(state.current.header.name).toBe("John Doe");
    });
    it("should update email", () => {
      const state = resumeReducer(
        initialState,
        updateHeader({ key: "email", value: "john@test.com" }),
      );
      expect(state.current.header.email).toBe("john@test.com");
    });
  });

  describe("updateSummary", () => {
    it("should update summary", () => {
      const state = resumeReducer(
        initialState,
        updateSummary("New summary text"),
      );
      expect(state.current.summary).toBe("New summary text");
    });
  });

  describe("toggleSection", () => {
    it("should toggle non-required section", () => {
      const state = resumeReducer(initialState, toggleSection("summary"));
      const section = state.current.sections.find((s) => s.id === "summary");
      expect(section.enabled).toBe(false);
    });
    it("should NOT toggle required section", () => {
      const state = resumeReducer(initialState, toggleSection("header"));
      const section = state.current.sections.find((s) => s.id === "header");
      expect(section.enabled).toBe(true);
    });
  });

  describe("toggleSkill", () => {
    it("should add skill if not present", () => {
      const state = resumeReducer(
        initialState,
        toggleSkill({ category: "Frontend", skill: "Vue JS" }),
      );
      expect(state.current.skills["Frontend"]).toContain("Vue JS");
    });
    it("should remove skill if already present", () => {
      const state = resumeReducer(
        initialState,
        toggleSkill({ category: "Frontend", skill: "React JS" }),
      );
      expect(state.current.skills["Frontend"]).not.toContain("React JS");
    });
  });

  describe("experience", () => {
    it("should add experience", () => {
      const state = resumeReducer(initialState, addExperience());
      expect(state.current.experience).toHaveLength(
        initialState.current.experience.length + 1,
      );
    });
    it("should update experience field", () => {
      const id = initialState.current.experience[0].id;
      const state = resumeReducer(
        initialState,
        updateExperience({ id, key: "company", value: "Google" }),
      );
      expect(state.current.experience[0].company).toBe("Google");
    });
    it("should remove experience", () => {
      const id = initialState.current.experience[0].id;
      const state = resumeReducer(initialState, removeExperience(id));
      expect(state.current.experience.find((e) => e.id === id)).toBeUndefined();
    });
  });

  describe("awards", () => {
    it("should add award", () => {
      const state = resumeReducer(initialState, addAward());
      expect(state.current.awards).toHaveLength(
        initialState.current.awards.length + 1,
      );
    });
    it("should remove award", () => {
      const id = initialState.current.awards[0].id;
      const state = resumeReducer(initialState, removeAward(id));
      expect(state.current.awards.find((a) => a.id === id)).toBeUndefined();
    });
  });

  describe("resetResume", () => {
    it("should reset to default state", () => {
      const modified = resumeReducer(initialState, setTitle("Modified"));
      const reset = resumeReducer(modified, resetResume());
      expect(reset.current.title).toBe("My Resume");
      expect(reset.current._id).toBeNull();
    });
  });
});
```

### `frontend/src/components/SkillsPanel/SkillsPanel.jsx`

```jsx
import { useDispatch, useSelector } from "react-redux";
import { toggleSkill, selectCurrent } from "../../store/resumeSlice";

const SKILL_CATALOG = {
  Frontend: [
    "React JS",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "SASS",
    "Next JS",
  ],
  "State Mgmt": ["Redux", "Redux-Toolkit", "Context API", "React Hooks"],
  Automation: ["Playwright", "Selenium", "Cypress", "Puppeteer"],
  Testing: ["Jest", "React Testing Library", "Enzyme", "Storybook"],
  Backend: ["Node JS", "Express JS", "MongoDB", "REST APIs", "JWT"],
};

export default function SkillsPanel() {
  const dispatch = useDispatch();
  const { skills } = useSelector(selectCurrent);
  return (
    <div data-testid="skills-panel">
      {Object.entries(SKILL_CATALOG).map(([cat, list]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: 6,
            }}
          >
            {cat}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {list.map((skill) => {
              const selected = (skills[cat] || []).includes(skill);
              return (
                <button
                  key={skill}
                  data-testid={`skill-btn-${skill.replace(/\s/g, "-")}`}
                  onClick={() =>
                    dispatch(toggleSkill({ category: cat, skill }))
                  }
                  style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    borderRadius: 99,
                    border: `1px solid ${selected ? "#6366f1" : "#d1d5db"}`,
                    background: selected ? "#eef2ff" : "#f9fafb",
                    color: selected ? "#4338ca" : "#374151",
                    cursor: "pointer",
                    fontWeight: selected ? 700 : 400,
                  }}
                >
                  {selected ? "✓ " : ""}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### `frontend/src/components/SkillsPanel/SkillsPanel.test.jsx`

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "../../store/resumeSlice";
import SkillsPanel from "./SkillsPanel";

const makeStore = (preloadedState) =>
  configureStore({ reducer: { resume: resumeReducer }, preloadedState });

describe("SkillsPanel", () => {
  it("renders all skill categories", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <SkillsPanel />
      </Provider>,
    );
    expect(screen.getByText(/frontend/i)).toBeInTheDocument();
    expect(screen.getByText(/automation/i)).toBeInTheDocument();
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
    expect(screen.getByText(/backend/i)).toBeInTheDocument();
  });

  it("shows React JS as selected by default", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <SkillsPanel />
      </Provider>,
    );
    const btn = screen.getByTestId("skill-btn-React-JS");
    expect(btn).toHaveStyle("background: #eef2ff");
  });

  it("toggles skill on click", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <SkillsPanel />
      </Provider>,
    );
    const btn =
      screen.getByTestId("skill-btn-Vue-JS") ||
      screen.getByTestId("skill-btn-Cypress");
    fireEvent.click(btn);
    expect(store.getState().resume.current.skills["Automation"]).toContain(
      "Cypress",
    );
  });

  it("deselects skill on second click", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <SkillsPanel />
      </Provider>,
    );
    const btn = screen.getByTestId("skill-btn-React-JS");
    fireEvent.click(btn);
    expect(store.getState().resume.current.skills["Frontend"]).not.toContain(
      "React JS",
    );
  });
});
```

### `frontend/src/components/ResumePreview/ResumePreview.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "../../store/resumeSlice";
import ResumePreview from "./ResumePreview";

const store = configureStore({ reducer: { resume: resumeReducer } });

describe("ResumePreview", () => {
  it("renders candidate name", () => {
    render(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    );
    expect(screen.getByText(/Sudhir A. Jedhe/i)).toBeInTheDocument();
  });
  it("renders email", () => {
    render(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    );
    expect(screen.getByText(/jedhesudhir@gmail.com/i)).toBeInTheDocument();
  });
  it("renders experience section", () => {
    render(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    );
    expect(screen.getByText(/Persistent Systems/i)).toBeInTheDocument();
  });
  it("renders skills section", () => {
    render(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    );
    expect(screen.getByText(/React JS/i)).toBeInTheDocument();
  });
});
```

### `frontend/src/App.test.jsx`

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

describe("App", () => {
  it("renders Resume Builder heading", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByText(/Resume Builder/i)).toBeInTheDocument();
  });
  it("renders Save button", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
  it("toggles preview mode", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    const btn = screen.getByRole("button", { name: /preview/i });
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});
```

---

## 🎭 PLAYWRIGHT E2E TESTS

### `frontend/playwright.config.js`

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### `frontend/e2e/resume.spec.js` — Main Resume Flow

```js
import { test, expect } from "@playwright/test";

test.describe("Resume Builder – Main Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the app", async ({ page }) => {
    await expect(page.getByText("Resume Builder")).toBeVisible();
    await expect(page.getByText("Redux")).toBeVisible();
  });

  test("should display default resume preview", async ({ page }) => {
    await expect(page.getByText("Sudhir A. Jedhe")).toBeVisible();
    await expect(page.getByText(/Senior React JS Developer/)).toBeVisible();
  });

  test("should edit header name and reflect in preview", async ({ page }) => {
    await page.getByRole("button", { name: /header/i }).click();
    const nameInput = page.getByLabel(/full name/i);
    await nameInput.clear();
    await nameInput.fill("John Developer");
    await expect(page.getByText("John Developer")).toBeVisible();
  });

  test("should edit summary", async ({ page }) => {
    await page.getByRole("button", { name: /summary/i }).click();
    const textarea = page.getByRole("textbox", { name: /summary/i });
    await textarea.clear();
    await textarea.fill("Updated professional summary for testing");
    await expect(page.getByText("Updated professional summary")).toBeVisible();
  });

  test("should switch template to dark", async ({ page }) => {
    const darkBtn = page.locator('[title="Dark"]').first();
    await darkBtn.click();
    const preview = page.locator('[data-testid="resume-preview"]');
    await expect(preview).toHaveCSS("background-color", "rgb(15, 23, 42)");
  });

  test("should toggle preview mode", async ({ page }) => {
    await page.getByRole("button", { name: /preview/i }).click();
    await expect(page.getByRole("button", { name: /edit/i })).toBeVisible();
    // Sidebar should be hidden
    await expect(
      page.locator('[data-testid="editor-sidebar"]'),
    ).not.toBeVisible();
  });

  test("should add new experience", async ({ page }) => {
    await page.getByRole("button", { name: /experience/i }).click();
    await page.getByRole("button", { name: /add experience/i }).click();
    const inputs = page.locator('input[placeholder*="Company"]');
    const last = inputs.last();
    await last.fill("Google");
    await expect(page.getByText("Google")).toBeVisible();
  });

  test("should remove experience", async ({ page }) => {
    await page.getByRole("button", { name: /experience/i }).click();
    const deleteBtn = page.locator('[data-testid="remove-exp"]').first();
    await deleteBtn.click();
    await expect(page.getByText("Persistent Systems")).not.toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByText("Resume Builder")).toBeVisible();
    await expect(page.locator('[data-testid="resume-preview"]')).toBeVisible();
  });

  test("should export PDF button exist", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /export pdf/i }),
    ).toBeVisible();
  });
});
```

### `frontend/e2e/skills.spec.js` — Skills Panel Tests

```js
import { test, expect } from "@playwright/test";

test.describe("Skills Panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /skills/i }).click();
  });

  test("should show all skill categories", async ({ page }) => {
    await expect(page.getByText(/frontend/i)).toBeVisible();
    await expect(page.getByText(/automation/i)).toBeVisible();
    await expect(page.getByText(/testing/i)).toBeVisible();
    await expect(page.getByText(/backend/i)).toBeVisible();
  });

  test("should show React JS as selected", async ({ page }) => {
    const reactBtn = page.getByTestId("skill-btn-React-JS");
    await expect(reactBtn).toBeVisible();
    await expect(reactBtn).toHaveText(/✓.*React JS/);
  });

  test("should toggle skill off", async ({ page }) => {
    const reactBtn = page.getByTestId("skill-btn-React-JS");
    await reactBtn.click();
    await expect(reactBtn).not.toHaveText(/✓/);
    // Skill should be removed from preview
    const preview = page.locator('[data-testid="resume-preview"]');
    await expect(preview.getByText("React JS")).not.toBeVisible();
  });

  test("should toggle skill on", async ({ page }) => {
    const vueBtn = page.getByTestId("skill-btn-Playwright");
    const initialText = await vueBtn.textContent();
    await vueBtn.click();
    const newText = await vueBtn.textContent();
    expect(newText).not.toBe(initialText);
  });

  test("should show Playwright skill", async ({ page }) => {
    await expect(page.getByTestId("skill-btn-Playwright")).toBeVisible();
  });
});
```

### `frontend/e2e/api.spec.js` — API Integration Tests

```js
import { test, expect } from "@playwright/test";

test.describe("API Integration", () => {
  test("should save resume via POST API", async ({ page }) => {
    await page.goto("/");
    // Intercept API call
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/resumes") &&
          res.request().method() === "POST",
      ),
      page.getByRole("button", { name: /save/i }).click(),
    ]);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data._id).toBeDefined();
  });

  test("should update resume via PUT API after save", async ({ page }) => {
    await page.goto("/");
    // First save
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForResponse(
      (res) =>
        res.url().includes("/api/resumes") && res.request().method() === "POST",
    );
    // Edit something
    await page.getByRole("button", { name: /header/i }).click();
    await page.getByLabel(/full name/i).fill("Updated Name");
    // Second save should be PUT
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/resumes") &&
          res.request().method() === "PUT",
      ),
      page.getByRole("button", { name: /save/i }).click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test("should load saved resumes via GET API", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /api/i }).click();
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/resumes") &&
          res.request().method() === "GET",
      ),
      page.getByRole("button", { name: /load all/i }).click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test("should show API server log entries", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /api/i }).click();
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page.getByText(/POST/)).toBeVisible();
    await expect(page.getByText(/\/api\/resumes/)).toBeVisible();
  });

  test("should handle API error gracefully", async ({ page }) => {
    await page.route("**/api/resumes", (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, message: "Server Error" }),
      }),
    );
    await page.goto("/");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
});
```

---

## 🚀 Setup & Run

### 1. Backend

```bash
cd backend
npm install
# Setup .env with your MONGO_URI
npm run dev          # Start server on :5000
npm test             # Run Jest tests
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev          # Start Vite on :5173
npm test             # Run Jest unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright with UI
```

### 3. Run All Tests

```bash
# Backend
cd backend && npm test

# Frontend Unit Tests
cd frontend && npm test

# Frontend E2E
cd frontend && npm run test:e2e
```

---

## 📊 Test Coverage Summary

| Layer              | Tool             | Tests                             |
| ------------------ | ---------------- | --------------------------------- |
| Backend API Routes | Jest + Supertest | GET, POST, PUT, DELETE            |
| Backend Controller | Jest (unit)      | All controller functions          |
| Redux Slice        | Jest             | All reducers + async thunks       |
| React Components   | RTL              | SkillsPanel, ResumePreview, App   |
| E2E – Main Flow    | Playwright       | Load, Edit, Preview, Add/Remove   |
| E2E – Skills       | Playwright       | Toggle on/off, Reflect in preview |
| E2E – API          | Playwright       | POST, PUT, GET, Error handling    |

Here is a review and architectural summary of your MERN stack Resume Builder codebase:

### Architectural Highlights

- **End-to-End Type and State Continuity**: The MongoDB Mongoose schema matches your Redux Toolkit `initialState` shape and API contract, avoiding unnecessary transformation logic between frontend and backend.
- **Solid Automated Testing Coverage**:
- **Backend**: Supertest integration tests use `mongodb-memory-server` to run tests against an in-memory database without polluting real environments.
- **Frontend Unit**: Redux slices and React components are verified in isolation using React Testing Library and standard `jsdom`.
- **E2E**: Playwright scripts cover client-side UI actions, responsive device viewports, and network call assertions using intercepted API responses.

- **Scalable Redux Setup**: Using `createAsyncThunk` along with dedicated selectors (`selectCurrent`, `selectList`, etc.) maintains clean separation between UI components and async state logic.

---

### Quick Start Checklist

To spin up and verify the entire stack locally:

```bash
# 1. Start MongoDB & Backend Server
cd backend
npm install
npm run dev

# 2. Start Frontend App (in a separate terminal)
cd frontend
npm install
npm run dev

# 3. Run full test suite across both tiers
cd backend && npm test
cd frontend && npm test
cd frontend && npm run test:e2e

```

How can I configure GitHub Actions to run these Jest and Playwright tests automatically on every pull request?

Here is a workflow configuration that automates your backend **Jest** tests, frontend **Jest** unit tests, and frontend **Playwright** E2E tests on every pull request.

---

### Step 1: Create the GitHub Actions Workflow File

Create a file in your repository at `.github/workflows/ci.yml`:

```yaml
name: MERN Stack Continuous Integration

on:
  pull_request:
    branches: [main, master, develop]
  push:
    branches: [main, master]

jobs:
  # ------------------------------------------------------------------
  # JOB 1: Backend Tests (Jest Integration + Unit)
  # ------------------------------------------------------------------
  backend-test:
    name: Backend Jest Tests
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: backend/package-lock.json

      - name: Install Backend Dependencies
        run: npm ci

      - name: Run Backend Jest Tests
        run: npm test
        env:
          NODE_ENV: test
          PORT: 5000
          MONGO_URI: mongodb://localhost:27017/test_db
          JWT_SECRET: ci_test_secret

  # ------------------------------------------------------------------
  # JOB 2: Frontend Unit Tests (Jest + React Testing Library)
  # ------------------------------------------------------------------
  frontend-unit-test:
    name: Frontend Jest Tests
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install Frontend Dependencies
        run: npm ci

      - name: Run Frontend Unit Tests
        run: npm test -- --watchAll=false --ci

  # ------------------------------------------------------------------
  # JOB 3: Frontend Playwright E2E Tests
  # ------------------------------------------------------------------
  frontend-e2e-test:
    name: Frontend Playwright E2E Tests
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install Dependencies
        run: npm ci

      - name: Get Playwright Version
        id: playwright-version
        run: echo "version=$(npx playwright --version | awk '{print $2}')" >> $GITHUB_OUTPUT

      - name: Cache Playwright Browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ steps.playwright-version.outputs.version }}

      - name: Install Playwright Browsers and Dependencies
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps

      - name: Install System Dependencies for Cached Browsers
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: npx playwright install-deps

      - name: Build Frontend Application
        run: npm run build

      - name: Run Playwright E2E Tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload Playwright Test Report Artifact
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 7
```

---

### Step 2: Ensure Your Configurations Support CI

#### 1. Configure `frontend/playwright.config.js` for WebServer

To allow Playwright to boot Vite automatically during CI without requiring a separate running server, update `webServer` in `frontend/playwright.config.js`:

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: process.env.CI ? 2 : 0, // Retry failed tests twice on CI
  workers: process.env.CI ? 1 : undefined, // Run sequentially on CI runners
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

#### 2. Verify `frontend/package.json` Scripts

Ensure your `scripts` in `frontend/package.json` contain non-interactive test flags:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "jest --watchAll=false --ci",
  "test:e2e": "playwright test"
}

```

---

### Key Workflow Features

1. **Parallel Job Execution**: Backend tests, Frontend Jest tests, and Playwright E2E runs execute simultaneously across separate GitHub runner VMs, reducing overall CI runtime.
2. **Playwright Binary Caching**: Browser binaries (~300MB+) are cached between runs using `actions/cache`. They only re-download when you update your Playwright version.
3. **Npm Caching**: Clean `npm ci` installs use `actions/setup-node` built-in package caching based on `package-lock.json` hash signatures.
4. **Artifact Uploads**: If E2E tests fail or complete, the Playwright HTML report (including failure screenshots and video traces) is attached to the GitHub Action summary for debugging.

How do I add a step that posts the E2E test results summary directly onto the GitHub Pull Request comments?

To post your Playwright E2E test results directly onto a Pull Request as a formatted comment, you can use **`playwright-json-summary-reporter`** paired with **`marocchino/sticky-pull-request-comment`**.

Using a _sticky comment_ updates a single comment on every new commit rather than spamming the PR conversation with dozens of duplicate messages.

---

### Step 1: Install the JSON Summary Reporter

In your `frontend` directory, install the summary reporter package:

```bash
cd frontend
npm install -D playwright-json-summary-reporter

```

Update your `frontend/playwright.config.js` to include the summary reporter:

```javascript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // Add the json-summary reporter alongside standard list/html reporters
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["playwright-json-summary-reporter", { outputFile: "summary.json" }],
  ],
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### Step 2: Update Your GitHub Actions Workflow

In your `.github/workflows/ci.yml` file, add permissions to write PR comments, parse the JSON output into a formatted Markdown table, and post it to the PR.

Update your `frontend-e2e-test` job like this:

```yaml
frontend-e2e-test:
  name: Frontend Playwright E2E Tests
  runs-on: ubuntu-latest

  # Required permissions to post or update comments on Pull Requests
  permissions:
    pull-requests: write
    contents: read

  defaults:
    run:
      working-directory: ./frontend

  steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: "npm"
        cache-dependency-path: frontend/package-lock.json

    - name: Install Dependencies
      run: npm ci

    - name: Get Playwright Version
      id: playwright-version
      run: echo "version=$(npx playwright --version | awk '{print $2}')" >> $GITHUB_OUTPUT

    - name: Cache Playwright Browsers
      uses: actions/cache@v4
      id: playwright-cache
      with:
        path: ~/.cache/ms-playwright
        key: ${{ runner.os }}-playwright-${{ steps.playwright-version.outputs.version }}

    - name: Install Playwright Browsers and Dependencies
      if: steps.playwright-cache.outputs.cache-hit != 'true'
      run: npx playwright install --with-deps

    - name: Install System Dependencies for Cached Browsers
      if: steps.playwright-cache.outputs.cache-hit == 'true'
      run: npx playwright install-deps

    - name: Run Playwright E2E Tests
      run: npm run test:e2e
      env:
        CI: true

    # Format the summary JSON into a clean Markdown comment
    - name: Format PR Comment Summary
      if: ${{ always() && github.event_name == 'pull_request' }}
      id: format-comment
      run: |
        if [ -f summary.json ]; then
          PASSED=$(node -e "console.log(require('./summary.json').passed)")
          FAILED=$(node -e "console.log(require('./summary.json').failed)")
          SKIPPED=$(node -e "console.log(require('./summary.json').skipped)")
          TOTAL=$(node -e "console.log(require('./summary.json').total)")
          
          STATUS_EMOJI="✅"
          if [ "$FAILED" -gt "0" ]; then
            STATUS_EMOJI="❌"
          fi

          COMMENT_BODY="## ${STATUS_EMOJI} Playwright E2E Test Results

          | Metric | Count |
          | :--- | :--- |
          | **Total Tests** | ${TOTAL} |
          | **Passed** | ✅ ${PASSED} |
          | **Failed** | ❌ ${FAILED} |
          | **Skipped** | ⚠️ ${SKIPPED} |

          *Commit:* \`${{ github.sha }}\`
          "
        else
          COMMENT_BODY="## ⚠️ Playwright E2E Run Completed
          *No summary report found.*"
        fi

        echo "comment_body<<EOF" >> $GITHUB_OUTPUT
        echo "$COMMENT_BODY" >> $GITHUB_OUTPUT
        echo "EOF" >> $GITHUB_OUTPUT

    # Post or update the PR comment
    - name: Post PR Sticky Comment
      if: ${{ always() && github.event_name == 'pull_request' }}
      uses: marocchino/sticky-pull-request-comment@v2
      with:
        header: e2e-playwright-summary
        message: ${{ steps.format-comment.outputs.comment_body }}

    - name: Upload Playwright Test Report Artifact
      if: ${{ !cancelled() }}
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: frontend/playwright-report/
        retention-days: 7
```

---

### What This PR Comment Looks Like

When a PR is created or updated, GitHub Actions automatically appends a sticky comment to the pull request conversation thread:

> ## ✅ Playwright E2E Test Results
>
> | Metric          | Count |
> | --------------- | ----- |
> | **Total Tests** | 12    |
> | **Passed**      | ✅ 12 |
> | **Failed**      | ❌ 0  |
> | **Skipped**     | ⚠️ 0  |
>
> _Commit:_ `a1b2c3d`

Key advantages of this setup:

1. **Always runs (`always()`)**: The comment posts regardless of whether tests pass or fail.
2. **Sticky ID (`header: e2e-playwright-summary`)**: On subsequent pushes to the same PR, the bot updates the existing comment instead of posting new ones.
3. **`pull-requests: write`**: Keeps permissions scoped tightly to PR commenting without granting full admin rights.
4. To post your **Jest code coverage summary tables** (for both backend and frontend) directly onto Pull Request comments alongside your Playwright results, you can use the **`jest-coverage-report-action`** GitHub Action.

This action automatically runs Jest, parses the coverage output, and posts or updates a clean, interactive Markdown coverage breakdown on the PR.

---

### Step 1: Ensure Jest Generates the `json-summary` Reporter

To allow actions or scripts to parse Jest coverage accurately, configure Jest to generate a `json-summary` report along with standard text output.

#### In `backend/package.json`:

```json
"jest": {
  "testEnvironment": "node",
  "setupFilesAfterFramework": ["./tests/setup.js"],
  "coverageReporters": ["text", "json-summary", "lcov"]
}

```

#### In `frontend/package.json`:

```json
"jest": {
  "testEnvironment": "jsdom",
  "setupFilesAfterFramework": ["@testing-library/jest-dom"],
  "moduleNameMapper": { "\\.(css|scss)$": "identity-obj-proxy" },
  "transform": { "^.+\\.(js|jsx)$": "babel-jest" },
  "coverageReporters": ["text", "json-summary", "lcov"]
}

```

---

### Step 2: Update Your GitHub Actions Workflow

Below is the complete updated `.github/workflows/ci.yml` file. It runs backend and frontend Jest coverage checks using `artiomtr/jest-coverage-report-action` and attaches all test results (Backend Coverage, Frontend Coverage, and Playwright E2E results) to the PR thread.

```yaml
name: MERN Stack Continuous Integration

on:
  pull_request:
    branches: [main, master, develop]
  push:
    branches: [main, master]

permissions:
  pull-requests: write
  contents: read

jobs:
  # ------------------------------------------------------------------
  # JOB 1: Backend Jest Tests & Coverage PR Comment
  # ------------------------------------------------------------------
  backend-test:
    name: Backend Tests & Coverage
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: backend/package-lock.json

      - name: Install Dependencies
        run: npm ci

      # Generates & posts Jest coverage table directly to the PR
      - name: Run Backend Coverage & Post Comment
        if: github.event_name == 'pull_request'
        uses: artiomtr/jest-coverage-report-action@v2
        with:
          working-directory: backend
          test-script: npm test -- --coverage
          custom-title: "📂 Backend Code Coverage Results"
          comment-filename: backend-coverage

  # ------------------------------------------------------------------
  # JOB 2: Frontend Jest Unit Tests & Coverage PR Comment
  # ------------------------------------------------------------------
  frontend-unit-test:
    name: Frontend Unit Tests & Coverage
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install Dependencies
        run: npm ci

      # Generates & posts Jest coverage table directly to the PR
      - name: Run Frontend Coverage & Post Comment
        if: github.event_name == 'pull_request'
        uses: artiomtr/jest-coverage-report-action@v2
        with:
          working-directory: frontend
          test-script: npm test -- --coverage --watchAll=false --ci
          custom-title: "🎨 Frontend Code Coverage Results"
          comment-filename: frontend-coverage

  # ------------------------------------------------------------------
  # JOB 3: Frontend Playwright E2E Tests & PR Comment
  # ------------------------------------------------------------------
  frontend-e2e-test:
    name: Frontend Playwright E2E Tests
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install Dependencies
        run: npm ci

      - name: Get Playwright Version
        id: playwright-version
        run: echo "version=$(npx playwright --version | awk '{print $2}')" >> $GITHUB_OUTPUT

      - name: Cache Playwright Browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ steps.playwright-version.outputs.version }}

      - name: Install Playwright Browsers and Dependencies
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps

      - name: Install System Dependencies for Cached Browsers
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: npx playwright install-deps

      - name: Run Playwright E2E Tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Format Playwright PR Comment
        if: ${{ always() && github.event_name == 'pull_request' }}
        id: format-comment
        run: |
          if [ -f summary.json ]; then
            PASSED=$(node -e "console.log(require('./summary.json').passed)")
            FAILED=$(node -e "console.log(require('./summary.json').failed)")
            SKIPPED=$(node -e "console.log(require('./summary.json').skipped)")
            TOTAL=$(node -e "console.log(require('./summary.json').total)")
            
            STATUS_EMOJI="✅"
            if [ "$FAILED" -gt "0" ]; then
              STATUS_EMOJI="❌"
            fi

            COMMENT_BODY="## ${STATUS_EMOJI} Playwright E2E Test Results

            | Metric | Count |
            | :--- | :--- |
            | **Total Tests** | ${TOTAL} |
            | **Passed** | ✅ ${PASSED} |
            | **Failed** | ❌ ${FAILED} |
            | **Skipped** | ⚠️ ${SKIPPED} |

            *Commit:* \`${{ github.sha }}\`
            "
          else
            COMMENT_BODY="## ⚠️ Playwright E2E Run Completed
            *No summary report found.*"
          fi

          echo "comment_body<<EOF" >> $GITHUB_OUTPUT
          echo "$COMMENT_BODY" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Post Playwright Sticky Comment
        if: ${{ always() && github.event_name == 'pull_request' }}
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: e2e-playwright-summary
          message: ${{ steps.format-comment.outputs.comment_body }}

      - name: Upload Playwright Test Report Artifact
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 7
```

---

### What The PR Comments Will Look Like

When a Pull Request is opened or updated, GitHub Actions will post/update three organized sticky comments:

#### 1. 📂 Backend Code Coverage Results

> ### 📂 Backend Code Coverage Results
>
> | Status | Category       | Percentage | Covered / Total |
> | ------ | -------------- | ---------- | --------------- |
> | 🟢     | **Statements** | **94.2%**  | 65 / 69         |
> | 🟢     | **Branches**   | **88.5%**  | 23 / 26         |
> | 🟢     | **Functions**  | **100%**   | 12 / 12         |
> | 🟢     | **Lines**      | **94.2%**  | 65 / 69         |
>
> | File                              | % Stmts | % Branch | % Funcs | % Lines |
> | --------------------------------- | ------- | -------- | ------- | ------- |
> | `controllers/resumeController.js` | 92.5%   | 85.0%    | 100%    | 92.5%   |
> | `models/Resume.js`                | 100%    | 100%     | 100%    | 100%    |

#### 2. 🎨 Frontend Code Coverage Results

> ### 🎨 Frontend Code Coverage Results
>
> _(Shows statement, branch, and function breakdown for Redux slices and components like `SkillsPanel.jsx`)_

#### 3. ✅ Playwright E2E Test Results

> _(Shows the summary table for Playwright browser suite runs)_

---

### Highlights of This Setup

1. **Isolated Headers**: Using `custom-title` and `comment-filename` ensures Backend Coverage, Frontend Coverage, and Playwright results post as distinct, easy-to-read sections without stepping on each other.
2. **Expandable Collapsibles**: The action automatically generates expandable `<details>` dropdowns listing file-by-file line coverage changes.
3. **Commit Diff Delta**: If a PR decreases code coverage, the action flags the specific line percentage drop in red directly in the summary table.

How can I configure Jest thresholds in package.json to automatically fail CI if coverage drops below 80%?

Here is how to set up **Jest coverage thresholds** in your `package.json` files so that Jest exits with a non-zero status code (causing CI to fail) whenever code coverage falls below your target threshold.

---

### Step 1: Update `package.json` Thresholds

You can configure thresholds globally across all files or set specific targets for critical folders.

#### 1. Backend Thresholds (`backend/package.json`)

Add the `coverageThreshold` configuration inside the existing `"jest"` key:

```json
"jest": {
  "testEnvironment": "node",
  "setupFilesAfterFramework": ["./tests/setup.js"],
  "coverageReporters": ["text", "json-summary", "lcov"],
  "collectCoverageFrom": [
    "controllers/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
    "!server.js"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}

```

#### 2. Frontend Thresholds (`frontend/package.json`)

Add `coverageThreshold` to your frontend Jest setup while excluding boilerplate/entry files like `main.jsx`:

```json
"jest": {
  "testEnvironment": "jsdom",
  "setupFilesAfterFramework": ["@testing-library/jest-dom"],
  "moduleNameMapper": { "\\.(css|scss)$": "identity-obj-proxy" },
  "transform": { "^.+\\.(js|jsx)$": "babel-jest" },
  "coverageReporters": ["text", "json-summary", "lcov"],
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/**/*.test.{js,jsx}"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    },
    "./src/store/": {
      "branches": 90,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
}

```

---

### Step 2: What Happens When Tests Run

#### When Coverage Passes (>= 80% across all metrics):

Jest completes with exit code `0` and outputs standard test summaries:

```text
PASS  tests/resume.test.js
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |    85.2 |     81.8 |      88 |    85.2 |
----------------------|---------|----------|---------|---------|-------------------
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total

```

#### When Coverage Fails (< 80% on any metric):

Jest prints explicit failure details for each failing threshold and exits with code `1`, halting the GitHub Actions CI pipeline:

```text
Jest: "global" coverage threshold for branches (80%) not met: 73.5%
Jest: "global" coverage threshold for lines (80%) not met: 78.2%
Error: Process completed with exit code 1.

```

---

### Step 3: Integrate with GitHub Actions CI

Since Jest naturally throws a non-zero exit code when thresholds aren't met, your existing GitHub Actions step will automatically mark the job as **Failed ❌** and prevent PRs from being merged if branch protection rules are enabled.

Your script command in both frontend and backend package scripts should invoke `--coverage`:

```json
"scripts": {
  "test": "jest --coverage"
}

```

In GitHub Actions, run:

```yaml
- name: Run Backend Tests with Threshold Check
  run: npm test
```

---

### Pro-Tip: Path-Specific Granularity

You don't have to enforce 80% uniformly everywhere. You can tighten rules on core domain logic (e.g., Redux state, pricing logic) while keeping UI components slightly lower:

```json
"coverageThreshold": {
  "global": {
    "statements": 80,
    "branches": 75
  },
  "./src/store/": {
    "statements": 95,
    "branches": 90
  },
  "./src/api/": {
    "statements": 85
  }
}

```

Setting up **Husky** and **lint-staged** prevents broken code or coverage regressions from ever hitting your Git remote.

Running a _full_ test suite on every single commit can slow down your workflow, so the ideal setup is:

- **Pre-commit hook**: Runs `lint-staged` to format, lint, and run fast, targeted Jest unit tests _only on staged files_.
- **Pre-push hook**: Runs your full Jest coverage suite (with coverage thresholds) to ensure everything passes before code leaves your machine.

---

### Step 1: Install Husky and lint-staged

In your project root (or inside `frontend`/`backend` if they are standalone repositories), run:

```bash
npm install --save-dev husky lint-staged

```

Initialize Husky in your repository:

```bash
npx husky init

```

This creates a `.husky/` directory at the root and adds a `"prepare": "husky"` script to your root `package.json`.

---

### Step 2: Configure `lint-staged` in `package.json`

Add a `"lint-staged"` configuration to your `package.json`. Using `--findRelatedTests` tells Jest to run **only the unit tests that import or cover the modified files**, keeping your commits fast!

#### Root `package.json` setup (for monorepos / nested folders):

```json
{
  "name": "resume-builder",
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "backend/**/*.js": ["npm run test:backend:staged"],
    "frontend/src/**/*.{js,jsx}": ["npm run test:frontend:staged"]
  }
}
```

#### Corresponding scripts in your root/subfolder `package.json`:

```json
"scripts": {
  "test:backend:staged": "jest --config backend/jest.config.js --bail --findRelatedTests",
  "test:frontend:staged": "jest --config frontend/jest.config.js --bail --findRelatedTests --passWithNoTests"
}

```

- `--findRelatedTests`: Runs tests related to currently staged files only.
- `--bail`: Immediately stops test execution on the first failure.
- `--passWithNoTests`: Prevents Jest from throwing an error if you stage a file that doesn't have a test suite.

---

### Step 3: Configure the `pre-commit` Hook

Edit the `.husky/pre-commit` file generated in Step 1 to trigger `lint-staged`:

```bash
#!/bin/sh
npx lint-staged

```

Whenever you run `git commit`, Husky will trigger `lint-staged`, running fast tests on your staged files before allowing the commit to complete.

---

### Step 4: Configure the `pre-push` Hook (Full Coverage Check)

To ensure your full 80% coverage threshold passes before pushing to GitHub, create a `pre-push` hook:

```bash
npx husky add .husky/pre-push "npm test"

```

_(Note: If you are using Husky v9+, simply create `.husky/pre-push` manually and paste the shell command)._

Inside `.husky/pre-push`:

```bash
#!/bin/sh
echo "🔍 Running full test coverage suite before push..."

# Run backend coverage check
cd backend && npm test || exit 1

# Run frontend coverage check
cd ../frontend && npm test || exit 1

```

---

### Step 5: Test the Setup

1. **Test `pre-commit**`:
Modify a React component (e.g., `frontend/src/components/SkillsPanel/SkillsPanel.jsx`) and stage it:

```bash
git add frontend/src/components/SkillsPanel/SkillsPanel.jsx
git commit -m "refactor: update skills panel UI"

```

_Husky will trigger `lint-staged` and run only `SkillsPanel.test.jsx` in seconds._ 2. **Test `pre-push**`:
Push your changes:

```bash
git push origin feature/my-new-branch

```

_Husky will trigger the full coverage suite. If coverage falls below 80%, the push is blocked!_

---

### Bypassing Hooks (Emergency Only)

If you need to bypass hooks during emergency hotfixes:

```bash
# Bypass pre-commit hook
git commit -m "hotfix: urgent change" --no-verify

# Bypass pre-push hook
git push origin main --no-verify

```

How do I configure Commitlint with Husky to enforce standard commit message formats like feat: or fix:?

Setting up **Commitlint** with **Husky** ensures every commit message follows the **Conventional Commits** specification (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, etc.). If a message doesn't fit the standard format, Git blocks the commit before it happens.

---

### Step 1: Install Commitlint Dependencies

In your project root directory, install `@commitlint/cli` and the standard `@commitlint/config-conventional` ruleset:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional

```

---

### Step 2: Create the Commitlint Configuration File

Create a file named `commitlint.config.js` in your project root:

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Custom rule adjustments (optional)
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    "subject-case": [0], // Allows any case in subject line (e.g. Uppercase or lowercase)
  },
};
```

---

### Step 3: Add the `commit-msg` Husky Hook

To tell Husky to validate commit messages using Commitlint, run the following command in your terminal:

#### For Husky v9+ (Latest):

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

```

_(Alternatively, manually create the `.husky/commit-msg` file and add the content below.)_

#### Content of `.husky/commit-msg`:

```bash
#!/bin/sh
npx --no -- commitlint --edit "$1"

```

Make sure the file is executable (Linux/macOS):

```bash
chmod +x .husky/commit-msg

```

---

### Step 4: Test Your Commit Message Enforcement

Try committing with an **invalid** message format:

```bash
git add .
git commit -m "added new resume template"

```

**Result (Blocked ❌):**

```text
⧗   input: added new resume template
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 3 errors, 0 warnings
husky - commit-msg hook script exited with code 1 (error)

```

Now try committing with a **valid** Conventional Commit message:

```bash
git commit -m "feat(template): add bold resume template layout"

```

**Result (Success ✅):**

```text
[main 1a2b3c4] feat(template): add bold resume template layout
 1 file changed, 10 insertions(+)

```

---

### Standard Conventional Commit Structure

For quick reference, standard commit messages should follow this pattern:

```text
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]

```

#### Common Examples:

- `feat: add PDF export feature`
- `fix(auth): handle expired JWT tokens correctly`
- `docs: update setup steps in README`
- `test(backend): add unit tests for resume controller`
- `refactor: optimize Redux state selectors`
- `chore: upgrade express dependency to v4.19`

How can I set up Commitizen so developers get an interactive CLI prompt when creating commits?
Setting up **Commitizen** gives developers an interactive terminal interface (`cz-cli`) that prompts for the commit type, scope, short description, body, and breaking changes. It then automatically formats the commit message according to your Conventional Commit rules so it never gets rejected by Commitlint.

---

### Step 1: Install Commitizen & Conventional Adapter

Run the following command in your project root to install Commitizen and the standard Conventional Changelog adapter:

```bash
npm install --save-dev commitizen cz-conventional-changelog

```

---

### Step 2: Configure Commitizen in `package.json`

Add a `config.commitizen` field to your root `package.json` pointing to the `cz-conventional-changelog` adapter, along with an `npm run commit` script helper:

```json
{
  "name": "resume-builder",
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

---

### Step 3: Integrate with Husky (Optional Hook Interception)

To enforce Commitizen whenever developers run standard `git commit` (instead of having to remember `npm run commit`), update your existing `.husky/prepare-commit-msg` hook or create a new one.

#### 1. Create or edit `.husky/prepare-commit-msg`:

```bash
#!/bin/sh
exec < /dev/tty
npx cz --hook || true

```

#### 2. Make it executable (Linux/macOS):

```bash
chmod +x .husky/prepare-commit-msg

```

> **How this works:** `exec < /dev/tty` attaches the interactive terminal input directly to the git process. Now, when a developer runs `git commit`, Husky intercepts it and launches the interactive Commitizen prompt.

---

### Step 4: Try It Out

Stage your changes and launch Commitizen:

```bash
git add .
npm run commit   # or simply 'git commit' if you configured Step 3

```

You will see an interactive prompt walking you through the steps:

```text
? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code
  refactor: A code change that neither fixes a bug nor fixes a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests

? What is the scope of this change (e.g. component or file name): (press enter to skip)
  resumeController

? Write a short, imperative tense description of the change (max 90 chars):
  add validation for user resume template selection

? Provide a longer description of the change: (press enter to skip)
  Ensures only supported templates (modern, dark, minimal, bold) are allowed.

? Are there any breaking changes? No
? Does this change affect any open issues? No

```

Once answered, Commitizen formats and commits the message as:
`feat(resumeController): add validation for user resume template selection`

---

### Pro-Tip: Customizing Prompts with `cz-customizable`

If you want custom scopes (e.g., `[backend]`, `[frontend]`, `[e2e]`) or localized prompts, replace `cz-conventional-changelog` with `cz-customizable`:

```bash
npm install --save-dev cz-customizable

```

Create `.cz-config.js` in your root:

```javascript
module.exports = {
  types: [
    { value: "feat", name: "feat:     A new feature" },
    { value: "fix", name: "fix:      A bug fix" },
    { value: "refactor", name: "refactor: Code optimization" },
    { value: "test", name: "test:     Adding unit or E2E tests" },
  ],
  scopes: [
    { name: "backend" },
    { name: "frontend" },
    { name: "redux" },
    { name: "e2e" },
    { name: "ci" },
  ],
  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
};
```

Update your `package.json`:

```json
"config": {
  "commitizen": {
    "path": "cz-customizable"
  }
}

```

How do I set up semantic-release in GitHub Actions to auto-generate changelogs based on these commit messages?

Setting up **`semantic-release`** in GitHub Actions automates your entire release workflow. Based on your Conventional Commit history (`feat:`, `fix:`, `BREAKING CHANGE:`), it automatically:

1. **Calculates the next version number** (Semantic Versioning: `PATCH`, `MINOR`, or `MAJOR`).
2. **Generates an updated `CHANGELOG.md**` file.
3. **Creates a Git tag and GitHub Release** with release notes attached.
4. **Publishes release summaries** back to Pull Requests and issues closed by the release.

---

### Step 1: Install `semantic-release` Dependencies

In your project root, install `semantic-release` and its standard plugin suite:

```bash
npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/github @semantic-release/exec

```

---

### Step 2: Create `.releaserc.json` Configuration

Create a file named `.releaserc.json` in your repository root to define how releases and changelogs are generated:

```json
{
  "branches": ["main", "master"],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits",
        "releaseRules": [
          { "type": "feat", "release": "minor" },
          { "type": "fix", "release": "patch" },
          { "type": "perf", "release": "patch" },
          { "type": "refactor", "release": "patch" },
          { "breaking": true, "release": "major" }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "preset": "conventionalcommits"
      }
    ],
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json", "package-lock.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
```

> **Note:** The `[skip ci]` tag inside the release commit message prevents GitHub Actions from triggering an infinite CI loop when committing the updated `CHANGELOG.md` back to the repository.

---

### Step 3: Add `release.yml` Workflow to GitHub Actions

Create a dedicated release workflow at `.github/workflows/release.yml`. This job runs on pushes to `main` **only after your test jobs pass**:

```yaml
name: Semantic Release

on:
  push:
    branches:
      - main
      - master

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  release:
    name: Release & Generate Changelog
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Fetch all history so semantic-release can analyze past tags and commits
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Run Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

---

### Step 4: Ensure Proper Repository Token Permissions

For `semantic-release` to create tags, update `CHANGELOG.md`, and publish GitHub Releases, configure repository permissions:

1. Go to your GitHub repository **Settings** → **Actions** → **General**.
2. Under **Workflow permissions**, select **Read and write permissions**.
3. Check **Allow GitHub Actions to create and approve pull requests**.
4. Click **Save**.

---

### How Version Bump Rules Trigger

`semantic-release` determines the next version based on commit messages merged into `main`:

| Merged Commit Message Pattern                                   | Version Bump | Example (`v1.0.0` → Next) |
| --------------------------------------------------------------- | ------------ | ------------------------- |
| `fix(api): handle null resume response`                         | **PATCH**    | `v1.0.1`                  |
| `feat(preview): add bold resume template`                       | **MINOR**    | `v1.1.0`                  |
| `feat!: drop node 16 support` _(or `BREAKING CHANGE:` in body)_ | **MAJOR**    | `v2.0.0`                  |
| `docs: update setup instructions`                               | _No Release_ | None                      |

---

### Output Example (`CHANGELOG.md`)

When a new release runs, `semantic-release` commits a formatted `CHANGELOG.md` file to your main branch:

```markdown
# [1.1.0](https://github.com/user/resume-builder/compare/v1.0.0...v1.1.0) (2026-07-28)

### Features

- **preview:** add bold resume template layout ([#42](https://github.com/user/resume-builder/issues/42)) ([a1b2c3d](https://github.com/user/resume-builder/commit/a1b2c3d))

### Bug Fixes

- **api:** handle null resume response when updating header ([#39](https://github.com/user/resume-builder/issues/39)) ([e5f6g7h](https://github.com/user/resume-builder/commit/e5f6g7h))
```

How can I hook this release workflow into Vercel or Docker image deployments upon new releases?

You can trigger production deployments directly from your release workflow in two ways: **Deploying frontend/backend services to Vercel** using the Vercel CLI, or **building and pushing multi-arch Docker images to Docker Hub (or GitHub Container Registry)**.

---

### Option A: Trigger Vercel Deployments on Release

Vercel provides an official CLI that allows you to trigger production deployments strictly when `semantic-release` cut a new version.

#### 1. Retrieve Vercel Credentials

To deploy from GitHub Actions, you need three values from Vercel:

- `VERCEL_TOKEN`: Go to **Vercel Account Settings** → **Tokens** → **Create Token**.
- `VERCEL_ORG_ID`: Found in your Vercel project `.vercel/project.json` file or Organization Settings.
- `VERCEL_PROJECT_ID`: Found in your **Vercel Project Settings** → **General**.

Add these three values to your GitHub repository under **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

#### 2. Configure Output Capture for `semantic-release`

Update your `.releaserc.json` file to write the new release version to an environment file or stdout:

```json
{
  "branches": ["main", "master"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/git",
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        "publishCmd": "echo \"NEW_RELEASE_PUBLISHED=true\" >> $GITHUB_ENV && echo \"RELEASE_VERSION=${nextRelease.version}\" >> $GITHUB_ENV"
      }
    ]
  ]
}
```

#### 3. Update `.github/workflows/release.yml` for Vercel

Append Vercel deployment steps that execute **only if a new release was published**:

```yaml
name: Release & Deploy to Vercel

on:
  push:
    branches:
      - main
      - master

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  release-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Run Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release

      # ------------------------------------------------------------------
      # VERCEL DEPLOYMENT STEP (Triggers only when NEW_RELEASE_PUBLISHED)
      # ------------------------------------------------------------------
      - name: Install Vercel CLI
        if: env.NEW_RELEASE_PUBLISHED == 'true'
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        if: env.NEW_RELEASE_PUBLISHED == 'true'
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build Project Artifacts on Vercel
        if: env.NEW_RELEASE_PUBLISHED == 'true'
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy Project to Production
        if: env.NEW_RELEASE_PUBLISHED == 'true'
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

### Option B: Build & Push Docker Images on Release

If you containerize your MERN backend or frontend, you can automatically build, tag, and publish Docker images to **GitHub Container Registry (GHCR)** or **Docker Hub** with exact version tags (`v1.2.0`, `latest`).

#### Update `.github/workflows/release.yml` for Docker

```yaml
name: Release & Publish Docker Image

on:
  push:
    branches:
      - main
      - master

permissions:
  contents: write
  packages: write
  pull-requests: write
  issues: write

jobs:
  release-and-docker:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Run Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release

      # ------------------------------------------------------------------
      # DOCKER PUBLISH STEPS (Triggers only when NEW_RELEASE_PUBLISHED)
      # ------------------------------------------------------------------
      - name: Set up Docker Buildx
        if: env.NEW_RELEASE_PUBLISHED == 'true'
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry (GHCR)
        if: env.NEW_RELEASE_PUBLISHED == 'true'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push Backend Docker Image
        if: env.NEW_RELEASE_PUBLISHED == 'true'
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/resume-builder-backend:${{ env.RELEASE_VERSION }}
            ghcr.io/${{ github.repository_owner }}/resume-builder-backend:latest
```

---

### Comparison Summary

| Method                   | Trigger Condition                     | Output                               | Best Used For                          |
| ------------------------ | ------------------------------------- | ------------------------------------ | -------------------------------------- |
| **Vercel CLI**           | `env.NEW_RELEASE_PUBLISHED == 'true'` | Live URL deployment                  | React/Vite Frontends, Next.js          |
| **Docker Buildx / GHCR** | `env.NEW_RELEASE_PUBLISHED == 'true'` | Container Image (`v1.2.0`, `latest`) | Node.js/Express Backend, Microservices |

How do I write optimized multi-stage Dockerfiles for both the backend Express app and frontend React Vite app?

Here are production-ready, optimized multi-stage Dockerfiles for both your backend Express server and frontend React Vite client, along with a unified `docker-compose.yml` to run the complete stack locally.

---

### 1. Backend Express App (`backend/Dockerfile`)

This multi-stage build creates an extremely lightweight runtime image by separating native dependency building from the production image and running as a non-root user for security.

```dockerfile
# ------------------------------------------------------------------------------
# Stage 1: Build & Dependencies Stage
# ------------------------------------------------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build/scripts)
RUN npm ci

# Copy backend source files
COPY . .

# Prune devDependencies to keep only production packages
RUN npm prune --production

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime Stage
# ------------------------------------------------------------------------------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy production node_modules and application code from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Security Best Practice: Do not run application as root
USER node

EXPOSE 5000

# Start Express server directly
CMD ["node", "server.js"]

```

---

### 2. Frontend React Vite App (`frontend/Dockerfile`)

This Dockerfile uses multi-stage builds to compile static React artifacts with Vite, then serves them using **Nginx Alpine**. This drops the container footprint from ~1GB down to **~25MB** and yields massive performance gains over running `vite preview` or `serve`.

```dockerfile
# ------------------------------------------------------------------------------
# Stage 1: Build React Static Assets with Vite
# ------------------------------------------------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package manifests to cache npm install
COPY package*.json ./

RUN npm ci

# Copy frontend source code
COPY . .

# Accept build argument for API URL during Vite bundling
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Build static assets (outputs to /app/dist)
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve Static Assets with Nginx Alpine
# ------------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

```

#### Custom Nginx Config (`frontend/nginx.conf`)

Create `frontend/nginx.conf` alongside your Dockerfile to handle client-side routing properly and enable gzipping:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression for static assets
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls directly to the Express backend container
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets long-term
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }
}

```

---

### 3. Orchestrate with Docker Compose (`docker-compose.yml`)

Place `docker-compose.yml` in the root of your project to run MongoDB, Backend, and Frontend together with automatic container networking and health checks.

```yaml
version: "3.8"

services:
  # Database Service
  mongodb:
    image: mongo:6-alpine
    container_name: resume_mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Express Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: resume_backend
    restart: always
    environment:
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/resume_builder
      JWT_SECRET: your_jwt_secret_key_here
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_healthy

  # React Frontend Service (Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:5000/api
    container_name: resume_frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

---

### How to Run Locally

```bash
# Build and start all services in detached mode
docker compose up -d --build

# View container status and logs
docker compose ps
docker compose logs -f

# Stop all containers
docker compose down

```

---

### Why These Patterns Excel

1. **Layer Caching**: `package*.json` files are copied before application code. Docker caches the `npm ci` layer and skips reinstalling packages when you change source files.
2. **Tiny Footprint**: Node.js alpine images combined with Nginx drop runtime memory usage dramatically and reduce security surface area.
3. **Client-Side Routing Fix**: The custom Nginx `try_files $uri $uri/ /index.html;` prevents 404 errors when refreshing SPA pages.
4. **Non-Root Execution**: Backend container runs under `USER node` instead of `root`, preventing container escape vulnerabilities in production.

How do I configure Docker layer caching (gha cache) in GitHub Actions to speed up container builds?

Configuring **Docker layer caching using the GitHub Actions cache backend (`type=gha`)** speeds up build times by keeping unchanged Docker layers in GitHub's native cache between CI runs.

Instead of rebuilding every layer from scratch on every pull request, Docker Buildx retrieves the cached layers directly from GitHub Actions storage.

---

### Step 1: Update Your GitHub Actions Workflow

Use the official `docker/setup-buildx-action` along with the `cache-from` and `cache-to` options in `docker/build-push-action`.

Here is an optimized GitHub Actions job for building and pushing your Express backend and React frontend images:

```yaml
name: Build and Push Docker Images with Layer Caching

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  docker-build:
    name: Build & Cache Docker Images
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write # Needed if pushing to ghcr.io

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      # 1. Set up Docker QEMU for multi-platform support (optional)
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      # 2. Set up Docker Buildx (required for gha cache backend)
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # 3. Log in to GitHub Container Registry (or Docker Hub)
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # ------------------------------------------------------------------
      # BUILD BACKEND IMAGE WITH GHA LAYER CACHING
      # ------------------------------------------------------------------
      - name: Build and Push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: |
            ghcr.io/${{ github.repository_owner }}/resume-backend:latest
            ghcr.io/${{ github.repository_owner }}/resume-backend:${{ github.sha }}
          # Enable GitHub Actions caching
          cache-from: type=gha,scope=backend
          cache-to: type=gha,mode=max,scope=backend

      # ------------------------------------------------------------------
      # BUILD FRONTEND IMAGE WITH GHA LAYER CACHING
      # ------------------------------------------------------------------
      - name: Build and Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          build-args: |
            VITE_API_URL=http://localhost:5000/api
          tags: |
            ghcr.io/${{ github.repository_owner }}/resume-frontend:latest
            ghcr.io/${{ github.repository_owner }}/resume-frontend:${{ github.sha }}
          # Enable GitHub Actions caching
          cache-from: type=gha,scope=frontend
          cache-to: type=gha,mode=max,scope=frontend
```

---

### Step 2: Key Caching Options Explained

- **`cache-from: type=gha,scope=backend`**
  Instructs Buildx to look for existing build layer caches stored in GitHub Actions under the `backend` scope.
- **`cache-to: type=gha,mode=max,scope=backend`**
  Tells Buildx to write new layer caches back to GitHub Actions:
- **`mode=max`**: Caches layers for **all build stages** (including multi-stage build stages like `builder` and intermediate dependencies), not just the final runner image (`mode=min`). This is critical for node_modules compilation steps.
- **`scope=backend` / `scope=frontend**`: Prevents the backend and frontend builds from overwriting or thrashing each other's cache entries.

---

### Performance Difference

| Build Run                            | Without Layer Caching                         | With `type=gha` Caching                           |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------- |
| **First Run (Cold)**                 | ~3–5 minutes                                  | ~3–5 minutes                                      |
| **Subsequent Runs (Code Change)**    | ~3–5 minutes _(re-installs npm dependencies)_ | **~30–45 seconds** _(uses cached `npm ci` layer)_ |
| **Subsequent Runs (No Code Change)** | ~3–5 minutes                                  | **~10–15 seconds**                                |

---

### Tips for Maximum Cache Hits

1. **Keep `package*.json` copies separate from source code**:
   Ensure your Dockerfiles copy dependency files before full source files:

```dockerfile
# Good: Allows Docker to cache npm ci layer unless package.json changes
COPY package*.json ./
RUN npm ci
COPY . .

```

2. **Scope Isolation**: Always assign unique `scope` parameters when building multiple images in the same workflow so they don't overwrite each other's cache entries in GitHub's 10GB per-repo storage limit.

How do I configure docker-compose.override.yml for local development with hot-reloading (nodemon & Vite HMR)?

Using a `docker-compose.override.yml` file allows you to keep your production `docker-compose.yml` clean while adding local development features like **hot-reloading for nodemon** and **Vite Hot Module Replacement (HMR)** via volume mounts.

Docker Compose automatically picks up `docker-compose.override.yml` alongside `docker-compose.yml` when you run `docker compose up`.

---

### Step 1: Update Frontend Vite Config for HMR inside Docker

For Vite's Hot Module Replacement (HMR) to communicate smoothly through Docker containers to your browser host, add a small `server.watch` and `server.hmr` block to your `frontend/vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces (0.0.0.0)
    port: 5173,
    watch: {
      usePolling: true, // Required for Docker volume file change detection on macOS/Windows
    },
    hmr: {
      clientPort: 5173, // Ensures browser connects to the exposed host port
    },
  },
});
```

---

### Step 2: Create `docker-compose.override.yml`

Create a `docker-compose.override.yml` file in the project root alongside your `docker-compose.yml`:

```yaml
version: "3.8"

services:
  # ------------------------------------------------------------------
  # Backend Development Override (Nodemon + Source Mounts)
  # ------------------------------------------------------------------
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    # Override production command to use nodemon
    command: npx nodemon server.js
    environment:
      NODE_ENV: development
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/resume_builder_dev
    volumes:
      - ./backend:/app # Bind mount local code into container
      - /app/node_modules # Anonymous volume to prevent overwriting container node_modules

  # ------------------------------------------------------------------
  # Frontend Development Override (Vite Dev Server + HMR)
  # ------------------------------------------------------------------
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    # Override production Nginx build to run Vite dev server directly
    command: npm run dev -- --host
    environment:
      NODE_ENV: development
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "5173:5173" # Expose Vite dev server port
    volumes:
      - ./frontend:/app # Bind mount local React code into container
      - /app/node_modules # Anonymous volume to prevent overwriting container node_modules
```

---

### How Volume Mounting Prevents `node_modules` Mismatches

Notice these two volume declarations in the override configuration:

```yaml
volumes:
  - ./frontend:/app # Mounts host source files into /app
  - /app/node_modules # Keeps container's isolated node_modules intact
```

- **`./frontend:/app`**: Syncs your local code changes directly into the running container so Vite and nodemon pick them up instantly.
- **`/app/node_modules`**: Prevents your host operating system's local `node_modules` directory from overwriting the Linux-compiled binaries inside the container.

---

### Step 3: Run Your Development Environment

Start your stack as usual:

```bash
docker compose up --build

```

Compose will merge `docker-compose.yml` and `docker-compose.override.yml`:

- **Frontend**: Accessible at `http://localhost:5173` with instant Vite HMR when editing React components.
- **Backend**: Accessible at `http://localhost:5000` with instant Nodemon server restarts when editing Express routes or controllers.
- **Database**: MongoDB running on `http://localhost:27017`.

To run in **production mode** without the overrides, explicitly target the base file:

```bash
docker compose -f docker-compose.yml up --build

```

How do I add Mongo Express to docker-compose.override.yml to view and manage MongoDB database collections visually?

Adding **Mongo Express**—a web-based MongoDB administrative interface—to your `docker-compose.override.yml` gives you a visual dashboard at `http://localhost:8081` to manage your local databases, collections, and resume documents during development.

---

### Step 1: Update `docker-compose.override.yml`

Add the `mongo-express` service block to your `docker-compose.override.yml` file:

```yaml
version: "3.8"

services:
  # ------------------------------------------------------------------
  # Backend Development Override (Nodemon + Source Mounts)
  # ------------------------------------------------------------------
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: npx nodemon server.js
    environment:
      NODE_ENV: development
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/resume_builder_dev
    volumes:
      - ./backend:/app
      - /app/node_modules

  # ------------------------------------------------------------------
  # Frontend Development Override (Vite Dev Server + HMR)
  # ------------------------------------------------------------------
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    command: npm run dev -- --host
    environment:
      NODE_ENV: development
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules

  # ------------------------------------------------------------------
  # Mongo Express Web UI Dashboard (Development Only)
  # ------------------------------------------------------------------
  mongo-express:
    image: mongo-express:latest
    container_name: resume_mongo_express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_SERVER: mongodb
      ME_CONFIG_MONGODB_PORT: 27017
      ME_CONFIG_MONGODB_ENABLE_ADMIN: "true"
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: pass
    depends_on:
      mongodb:
        condition: service_healthy
```

---

### Step 2: Key Environment Settings Explained

- **`ME_CONFIG_MONGODB_SERVER: mongodb`**: Points Mongo Express directly to the service name of your MongoDB container defined in `docker-compose.yml`.
- **`ME_CONFIG_BASICAUTH_USERNAME: admin`** & **`ME_CONFIG_BASICAUTH_PASSWORD: pass`**: Sets the web login credentials for accessing the visual dashboard.
- **`depends_on.mongodb.condition: service_healthy`**: Ensures Mongo Express waits until your MongoDB instance is fully running and responding to pings before booting up.

---

### Step 3: Run and Access the Dashboard

Start your local development stack:

```bash
docker compose up -d

```

1. Open **`http://localhost:8081`** in your browser.
2. Sign in with the credentials:

- **Username**: `admin`
- **Password**: `pass`

---

### Features Available in Mongo Express

- **Database & Collection Browsing**: View the `resume_builder_dev` database and inspect the `resumes` collection.
- **Document Management**: Insert, edit, or delete JSON documents representing resumes directly in the UI.
- **Indexes & Search**: Execute custom MongoDB queries (`{ "header.name": "Sudhir A. Jedhe" }`) and view document indexes.

How can I configure a MongoDB seed script in Docker Compose to populate dummy resume data automatically during development?

You can automatically populate your MongoDB database with dummy resume data whenever your development containers start up using MongoDB's built-in initialization directory **`/docker-entrypoint-initdb.d/`**.

When a MongoDB container initializes a fresh data volume, it automatically executes any `.js` or `.json` files placed in this directory.

---

### Step 1: Create the Seed Script

Create a new directory named `mongo-init` in your project root, and add an `init.js` script inside it:

#### `mongo-init/init.js`

```javascript
// Switch to (or create) the development database
db = db.getSiblingDB("resume_builder_dev");

// Clear existing sample resumes to avoid duplicates
db.resumes.drop();

// Insert dummy resume documents
db.resumes.insertMany([
  {
    title: "Senior Full Stack Resume",
    template: "modern",
    header: {
      name: "Sudhir A. Jedhe",
      title: "Senior React JS Developer | Project Lead",
      email: "jedhesudhir@gmail.com",
      phone: "8551873835",
      location: "India",
      linkedin: "linkedin.com/in/sudhirjedhe",
    },
    summary:
      "Senior React JS Developer with 10+ years of experience building scalable web applications.",
    skills: {
      Frontend: [
        "React JS",
        "TypeScript",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Next JS",
      ],
      State_Mgmt: ["Redux", "Redux-Toolkit", "Context API"],
      Automation: ["Playwright", "Selenium", "Cypress"],
      Testing: ["Jest", "React Testing Library"],
      Backend: ["Node JS", "Express JS", "MongoDB", "REST APIs"],
    },
    experience: [
      {
        company: "Persistent Systems",
        position: "Project Lead",
        duration: "Jan 2025 – Present",
        current: true,
        description:
          "Led teams for Microsoft and Intuit projects. Built Playwright automation testing frameworks.",
        skills: ["React JS", "Playwright", "TypeScript"],
      },
      {
        company: "HSBC Technology India",
        position: "Consultant Specialist",
        duration: "Feb 2023 – Dec 2023",
        current: false,
        description:
          "Built CCAT platform with global UI library and RESTful APIs.",
        skills: ["React JS", "Redux", "Node JS"],
      },
    ],
    education: [
      {
        degree: "BE Computer Engineering",
        institution: "University of Pune",
        year: "2012",
      },
    ],
    awards: [
      {
        title: "2x Spot Award",
        org: "MITR Learning Media",
        desc: "On-time delivery under tight deadlines",
      },
    ],
    sections: [
      { id: "header", label: "Header", enabled: true, required: true },
      { id: "summary", label: "Summary", enabled: true, required: false },
      { id: "skills", label: "Skills", enabled: true, required: false },
      { id: "experience", label: "Experience", enabled: true, required: false },
      { id: "education", label: "Education", enabled: true, required: false },
      { id: "awards", label: "Awards", enabled: true, required: false },
    ],
    userId: "guest",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Backend Engineer Resume",
    template: "minimal",
    header: {
      name: "Alex Rivera",
      title: "Backend Node.js Engineer",
      email: "alex.rivera@example.com",
      phone: "+1-555-0192",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexrivera",
    },
    summary:
      "Backend engineer specializing in distributed systems, REST/GraphQL APIs, and MongoDB optimization.",
    skills: {
      Backend: ["Node JS", "Express JS", "MongoDB", "Mongoose", "Redis"],
      DevOps: ["Docker", "GitHub Actions", "AWS"],
      Testing: ["Jest", "Supertest"],
    },
    experience: [
      {
        company: "CloudScale Tech",
        position: "Backend Engineer",
        duration: "Mar 2022 – Present",
        current: true,
        description:
          "Architected high-throughput REST APIs handling 5M+ daily requests.",
        skills: ["Node JS", "Express JS", "MongoDB"],
      },
    ],
    education: [
      {
        degree: "BS Computer Science",
        institution: "UC Berkeley",
        year: "2020",
      },
    ],
    awards: [],
    sections: [
      { id: "header", label: "Header", enabled: true, required: true },
      { id: "summary", label: "Summary", enabled: true, required: false },
      { id: "skills", label: "Skills", enabled: true, required: false },
      { id: "experience", label: "Experience", enabled: true, required: false },
    ],
    userId: "guest",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

print("✅ MongoDB seeded successfully with dummy resumes!");
```

---

### Step 2: Update `docker-compose.override.yml`

Mount the `mongo-init` folder into the `/docker-entrypoint-initdb.d/` directory inside your MongoDB service definition:

```yaml
version: "3.8"

services:
  # ------------------------------------------------------------------
  # MongoDB Service Override (Seed Script Mount)
  # ------------------------------------------------------------------
  mongodb:
    volumes:
      - mongo_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d:ro # Mount seed scripts as read-only

  # ------------------------------------------------------------------
  # Backend Development Override
  # ------------------------------------------------------------------
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: npx nodemon server.js
    environment:
      NODE_ENV: development
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/resume_builder_dev
    volumes:
      - ./backend:/app
      - /app/node_modules

  # ------------------------------------------------------------------
  # Frontend Development Override
  # ------------------------------------------------------------------
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    command: npm run dev -- --host
    environment:
      NODE_ENV: development
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules

  # ------------------------------------------------------------------
  # Mongo Express Dashboard
  # ------------------------------------------------------------------
  mongo-express:
    image: mongo-express:latest
    container_name: resume_mongo_express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_SERVER: mongodb
      ME_CONFIG_MONGODB_PORT: 27017
      ME_CONFIG_MONGODB_ENABLE_ADMIN: "true"
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: pass
    depends_on:
      mongodb:
        condition: service_healthy
```

---

### Step 3: Trigger the Seed Initialization

> **Important:** Official Mongo Docker images execute `/docker-entrypoint-initdb.d/` scripts **only when creating a new volume for the first time**.

If you already have a running MongoDB container with an existing volume, reset the volume so the seed script triggers:

```bash
# Stop containers and remove volumes
docker compose down -v

# Start containers fresh
docker compose up -d

```

---

### Step 4: Verify Seeded Data

1. **Via Express API**: Run `curl http://localhost:5000/api/resumes` to inspect the two pre-populated sample resumes.
2. **Via Mongo Express UI**: Navigate to `http://localhost:8081`, select `resume_builder_dev`, and open the `resumes` collection to visually browse or edit the seeded documents.

Adding **Redis** to your stack drastically cuts database read latency on GET requests. When a request hits your `GET /api/resumes` endpoint, Express checks Redis first. If the cache is populated (_cache hit_), it returns the cached data in milliseconds; if not (_cache miss_), it queries MongoDB, caches the result in Redis, and sends the response.

Here is a complete setup for adding Redis to `docker-compose.yml` and configuring response caching in Express.

---

### Step 1: Install `redis` Client in Backend

In your `backend` directory, install the official Redis client:

```bash
cd backend
npm install redis

```

---

### Step 2: Add Redis to `docker-compose.yml` & `docker-compose.override.yml`

#### 1. Update `docker-compose.yml`

Add the official `redis:alpine` service and connect it to your backend:

```yaml
version: "3.8"

services:
  # Database Service
  mongodb:
    image: mongo:6-alpine
    container_name: resume_mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache Service
  redis:
    image: redis:7-alpine
    container_name: resume_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Express Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: resume_backend
    restart: always
    environment:
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/resume_builder
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your_jwt_secret_key_here
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy

  # React Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:5000/api
    container_name: resume_frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo_data:
  redis_data:
```

#### 2. Update `backend` in `docker-compose.override.yml`

Add the `REDIS_URL` environment variable for your development environment override:

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  command: npx nodemon server.js
  environment:
    NODE_ENV: development
    PORT: 5000
    MONGO_URI: mongodb://mongodb:27017/resume_builder_dev
    REDIS_URL: redis://redis:6379
  volumes:
    - ./backend:/app
    - /app/node_modules
```

---

### Step 3: Create Redis Connection Module

Create a connection helper file at `backend/config/redis.js`:

```javascript
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
redisClient.on("connect", () => console.log("✅ Redis Connected Successfully"));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = { redisClient, connectRedis };
```

Update your `backend/server.js` to initialize Redis on startup:

```javascript
const { connectRedis } = require("./config/redis");

// Initialize DBs
connectDB();
connectRedis();
```

---

### Step 4: Create Redis Caching Middleware

Create a flexible caching middleware file at `backend/middleware/cache.js`. It will check for cached responses, and attach a helper to invalidate cache keys whenever data is mutated (POST/PUT/DELETE):

```javascript
const { redisClient } = require("../config/redis");

/**
 * Middleware to cache GET API responses
 * @param {string} keyPrefix - Unique key prefix (e.g. 'resumes')
 * @param {number} durationInSeconds - Cache TTL in seconds (default: 300s / 5 mins)
 */
const cacheMiddleware = (keyPrefix, durationInSeconds = 300) => {
  return async (req, res, next) => {
    // Generate cache key based on route path and params/query
    const cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`⚡ [Redis Cache HIT]: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log(`🐢 [Redis Cache MISS]: ${cacheKey}`);

      // Intercept res.json to store response in Redis before sending
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful 200 responses
        if (res.statusCode === 200 && body.success !== false) {
          redisClient
            .setEx(cacheKey, durationInSeconds, JSON.stringify(body))
            .catch((err) => console.error("Redis Set Error:", err));
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache Middleware Error:", error);
      next(); // Gracefully fallback to MongoDB if Redis fails
    }
  };
};

/**
 * Helper to clear matching cache keys on mutation (POST/PUT/DELETE)
 * @param {string} pattern - Key pattern to clear (e.g. 'resumes:*')
 */
const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(
        `🧹 [Redis Cache Cleared]: ${keys.length} keys matching '${pattern}'`,
      );
    }
  } catch (err) {
    console.error("Clear Cache Error:", err);
  }
};

module.exports = { cacheMiddleware, clearCache };
```

---

### Step 5: Update `resumeRoutes.js` and `resumeController.js`

#### 1. Apply Middleware to Routes (`backend/routes/resumeRoutes.js`)

Add `cacheMiddleware` to GET routes:

```javascript
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const { cacheMiddleware } = require("../middleware/cache");

const validateResume = [
  body("header.name").notEmpty().withMessage("Name is required"),
  body("header.email").isEmail().withMessage("Valid email required"),
];

// Cache GET /api/resumes for 5 minutes (300s)
router
  .route("/")
  .get(cacheMiddleware("resumes", 300), getResumes)
  .post(validateResume, createResume);

// Cache GET /api/resumes/:id for 5 minutes (300s)
router
  .route("/:id")
  .get(cacheMiddleware("resumes", 300), getResumeById)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router;
```

#### 2. Clear Cache on Mutations (`backend/controllers/resumeController.js`)

Import `clearCache` and invalidate the `resumes:*` key whenever a resume is created, updated, or deleted:

```javascript
const { clearCache } = require("../middleware/cache");

// @desc   POST create resume
const createResume = async (req, res) => {
  // ... existing validation & creation logic ...
  try {
    const resume = await Resume.create(req.body);
    await clearCache("resumes:*"); // Clear Redis cache on creation
    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   PUT update resume
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });

    await clearCache("resumes:*"); // Clear Redis cache on update
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   DELETE resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });

    await clearCache("resumes:*"); // Clear Redis cache on deletion
    res
      .status(200)
      .json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
```

---

### Testing Response Times

Rebuild and start your Docker Compose stack:

```bash
docker compose up -d --build

```

Test requests against the backend:

1. **First Request (Cache Miss)**:

```bash
curl -i http://localhost:5000/api/resumes

```

_Logs:_ `🐢 [Redis Cache MISS]: resumes:/api/resumes` (Response time: ~50–100ms) 2. **Second Request (Cache Hit)**:

```bash
curl -i http://localhost:5000/api/resumes

```

_Logs:_ `⚡ [Redis Cache HIT]: resumes:/api/resumes` (Response time: **~2–5ms**) 3. **Mutation Request (Cache Invalidation)**:
Creating or updating a resume via `POST` or `PUT` logs:
`🧹 [Redis Cache Cleared]: 2 keys matching 'resumes:*'`
The next `GET` automatically fetches fresh data from MongoDB and re-populates Redis.

Adding **Redis** to your stack drastically cuts database read latency on GET requests. When a request hits your `GET /api/resumes` endpoint, Express checks Redis first. If the cache is populated (_cache hit_), it returns the cached data in milliseconds; if not (_cache miss_), it queries MongoDB, caches the result in Redis, and sends the response.

Here is a complete setup for adding Redis to `docker-compose.yml` and configuring response caching in Express.

---

### Step 1: Install `redis` Client in Backend

In your `backend` directory, install the official Redis client:

```bash
cd backend
npm install redis

```

---

### Step 2: Add Redis to `docker-compose.yml` & `docker-compose.override.yml`

#### 1. Update `docker-compose.yml`

Add the official `redis:alpine` service and connect it to your backend:

```yaml
version: "3.8"

services:
  # Database Service
  mongodb:
    image: mongo:6-alpine
    container_name: resume_mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache Service
  redis:
    image: redis:7-alpine
    container_name: resume_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Express Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: resume_backend
    restart: always
    environment:
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/resume_builder
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your_jwt_secret_key_here
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy

  # React Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:5000/api
    container_name: resume_frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo_data:
  redis_data:
```

#### 2. Update `backend` in `docker-compose.override.yml`

Add the `REDIS_URL` environment variable for your development environment override:

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  command: npx nodemon server.js
  environment:
    NODE_ENV: development
    PORT: 5000
    MONGO_URI: mongodb://mongodb:27017/resume_builder_dev
    REDIS_URL: redis://redis:6379
  volumes:
    - ./backend:/app
    - /app/node_modules
```

---

### Step 3: Create Redis Connection Module

Create a connection helper file at `backend/config/redis.js`:

```javascript
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
redisClient.on("connect", () => console.log("✅ Redis Connected Successfully"));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = { redisClient, connectRedis };
```

Update your `backend/server.js` to initialize Redis on startup:

```javascript
const { connectRedis } = require("./config/redis");

// Initialize DBs
connectDB();
connectRedis();
```

---

### Step 4: Create Redis Caching Middleware

Create a flexible caching middleware file at `backend/middleware/cache.js`. It will check for cached responses, and attach a helper to invalidate cache keys whenever data is mutated (POST/PUT/DELETE):

```javascript
const { redisClient } = require("../config/redis");

/**
 * Middleware to cache GET API responses
 * @param {string} keyPrefix - Unique key prefix (e.g. 'resumes')
 * @param {number} durationInSeconds - Cache TTL in seconds (default: 300s / 5 mins)
 */
const cacheMiddleware = (keyPrefix, durationInSeconds = 300) => {
  return async (req, res, next) => {
    // Generate cache key based on route path and params/query
    const cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`⚡ [Redis Cache HIT]: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log(`🐢 [Redis Cache MISS]: ${cacheKey}`);

      // Intercept res.json to store response in Redis before sending
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful 200 responses
        if (res.statusCode === 200 && body.success !== false) {
          redisClient
            .setEx(cacheKey, durationInSeconds, JSON.stringify(body))
            .catch((err) => console.error("Redis Set Error:", err));
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache Middleware Error:", error);
      next(); // Gracefully fallback to MongoDB if Redis fails
    }
  };
};

/**
 * Helper to clear matching cache keys on mutation (POST/PUT/DELETE)
 * @param {string} pattern - Key pattern to clear (e.g. 'resumes:*')
 */
const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(
        `🧹 [Redis Cache Cleared]: ${keys.length} keys matching '${pattern}'`,
      );
    }
  } catch (err) {
    console.error("Clear Cache Error:", err);
  }
};

module.exports = { cacheMiddleware, clearCache };
```

---

### Step 5: Update `resumeRoutes.js` and `resumeController.js`

#### 1. Apply Middleware to Routes (`backend/routes/resumeRoutes.js`)

Add `cacheMiddleware` to GET routes:

```javascript
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const { cacheMiddleware } = require("../middleware/cache");

const validateResume = [
  body("header.name").notEmpty().withMessage("Name is required"),
  body("header.email").isEmail().withMessage("Valid email required"),
];

// Cache GET /api/resumes for 5 minutes (300s)
router
  .route("/")
  .get(cacheMiddleware("resumes", 300), getResumes)
  .post(validateResume, createResume);

// Cache GET /api/resumes/:id for 5 minutes (300s)
router
  .route("/:id")
  .get(cacheMiddleware("resumes", 300), getResumeById)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router;
```

#### 2. Clear Cache on Mutations (`backend/controllers/resumeController.js`)

Import `clearCache` and invalidate the `resumes:*` key whenever a resume is created, updated, or deleted:

```javascript
const { clearCache } = require("../middleware/cache");

// @desc   POST create resume
const createResume = async (req, res) => {
  // ... existing validation & creation logic ...
  try {
    const resume = await Resume.create(req.body);
    await clearCache("resumes:*"); // Clear Redis cache on creation
    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   PUT update resume
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });

    await clearCache("resumes:*"); // Clear Redis cache on update
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   DELETE resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });

    await clearCache("resumes:*"); // Clear Redis cache on deletion
    res
      .status(200)
      .json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
```

---

### Testing Response Times

Rebuild and start your Docker Compose stack:

```bash
docker compose up -d --build

```

Test requests against the backend:

1. **First Request (Cache Miss)**:

```bash
curl -i http://localhost:5000/api/resumes

```

_Logs:_ `🐢 [Redis Cache MISS]: resumes:/api/resumes` (Response time: ~50–100ms) 2. **Second Request (Cache Hit)**:

```bash
curl -i http://localhost:5000/api/resumes

```

_Logs:_ `⚡ [Redis Cache HIT]: resumes:/api/resumes` (Response time: **~2–5ms**) 3. **Mutation Request (Cache Invalidation)**:
Creating or updating a resume via `POST` or `PUT` logs:
`🧹 [Redis Cache Cleared]: 2 keys matching 'resumes:*'`
The next `GET` automatically fetches fresh data from MongoDB and re-populates Redis.

To test your backend application with Jest without running a live Redis server, you can use **`redis-mock`** (or `ioredis-mock`).

By mocking the Redis client module, your unit and integration tests run entirely in-memory, remain fast, and won't fail in environments like CI runners where Redis isn't running.

---

### Step 1: Install `redis-mock`

In your `backend` directory, install `redis-mock` as a dev dependency:

```bash
cd backend
npm install --save-dev redis-mock

```

---

### Step 2: Option A — Automatically Mock Redis Globally in `setup.js`

If you want **all tests** in your backend test suite to automatically use the mocked Redis client without touching individual test files:

#### 1. Configure `backend/package.json` or `jest.config.js`

Ensure your Jest setup file is configured:

```json
"jest": {
  "testEnvironment": "node",
  "setupFilesAfterEnv": ["./tests/setup.js"]
}

```

#### 2. Add the Mock to `backend/tests/setup.js`

In `tests/setup.js`, use `jest.mock()` to intercept imports of `redis` or your custom `backend/config/redis.js` module:

```javascript
// backend/tests/setup.js
const redisMock = require("redis-mock");

// Intercept all calls to 'redis' module across all tests
jest.mock("redis", () => ({
  createClient: jest.fn().mockImplementation(() => {
    const client = redisMock.createClient();

    // Polyfill v4 redis promises if needed by your app
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(true),
      get: jest.fn(
        (key) =>
          new Promise((resolve, reject) =>
            client.get(key, (err, val) => (err ? reject(err) : resolve(val))),
          ),
      ),
      set: jest.fn(
        (key, val) =>
          new Promise((resolve, reject) =>
            client.set(key, val, (err, res) =>
              err ? reject(err) : resolve(res),
            ),
          ),
      ),
      setEx: jest.fn(
        (key, sec, val) =>
          new Promise((resolve, reject) =>
            client.setex(key, sec, val, (err, res) =>
              err ? reject(err) : resolve(res),
            ),
          ),
      ),
      del: jest.fn(
        (key) =>
          new Promise((resolve, reject) =>
            client.del(key, (err, res) => (err ? reject(err) : resolve(res))),
          ),
      ),
      keys: jest.fn(
        (pattern) =>
          new Promise((resolve, reject) =>
            client.keys(pattern, (err, res) =>
              err ? reject(err) : resolve(res),
            ),
          ),
      ),
      sendCommand: jest.fn().mockResolvedValue("OK"),
      isOpen: true,
    };
  }),
}));
```

---

### Step 3: Option B — Mocking `backend/config/redis.js` Directly

If you prefer explicit control over the exact export interface defined in `backend/config/redis.js`:

#### Create `backend/tests/__mocks__/redis.js` (or mock inline in test files)

```javascript
// Mock implementation of config/redis.js
const redisDataStore = new Map();

const redisClient = {
  isOpen: true,
  connect: jest.fn().mockResolvedValue(true),
  on: jest.fn(),
  get: jest.fn(async (key) => redisDataStore.get(key) || null),
  set: jest.fn(async (key, value) => {
    redisDataStore.set(key, value);
    return "OK";
  }),
  setEx: jest.fn(async (key, seconds, value) => {
    redisDataStore.set(key, value);
    return "OK";
  }),
  del: jest.fn(async (keys) => {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    let count = 0;
    keysArray.forEach((k) => {
      if (redisDataStore.delete(k)) count++;
    });
    return count;
  }),
  keys: jest.fn(async (pattern) => {
    const regex = new RegExp(pattern.replace("*", ".*"));
    return Array.from(redisDataStore.keys()).filter((k) => regex.test(k));
  }),
  sendCommand: jest.fn().mockResolvedValue(1),
};

const connectRedis = jest.fn().mockResolvedValue(true);

module.exports = { redisClient, connectRedis, redisDataStore };
```

---

### Step 4: Integration Testing Example (Supertest + Mocked Redis)

Now you can write integration tests for your Express routes. The test will verify cache hits, cache misses, and cache invalidation without needing a running Redis container.

Create `backend/tests/cache.test.js`:

```javascript
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Resume = require("../models/Resume");

// Mock the Redis config module
jest.mock("../config/redis", () => {
  const store = new Map();
  return {
    connectRedis: jest.fn().mockResolvedValue(true),
    redisClient: {
      isOpen: true,
      get: jest.fn(async (key) => store.get(key) || null),
      setEx: jest.fn(async (key, sec, val) => {
        store.set(key, val);
        return "OK";
      }),
      keys: jest.fn(async (pattern) => {
        const regex = new RegExp(pattern.replace("*", ".*"));
        return Array.from(store.keys()).filter((k) => regex.test(k));
      }),
      del: jest.fn(async (keys) => {
        const arr = Array.isArray(keys) ? keys : [keys];
        arr.forEach((k) => store.delete(k));
        return arr.length;
      }),
      sendCommand: jest.fn().mockResolvedValue(1),
    },
  };
});

let mongoServer;

const sampleResume = {
  title: "Test Resume",
  header: { name: "Test User", email: "test@example.com" },
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Resume.deleteMany({});
});

describe("GET /api/resumes (Redis Caching)", () => {
  it("should query DB on first request and populate Redis cache", async () => {
    await Resume.create(sampleResume);

    // 1st Call: Cache Miss
    const res1 = await request(app).get("/api/resumes");
    expect(res1.statusCode).toBe(200);
    expect(res1.body.data).toHaveLength(1);

    // 2nd Call: Served from mocked Redis cache
    const res2 = await request(app).get("/api/resumes");
    expect(res2.statusCode).toBe(200);
    expect(res2.body.data).toHaveLength(1);
  });

  it("should invalidate Redis cache when creating a new resume", async () => {
    // Populate DB
    await Resume.create(sampleResume);

    // Seed cache with GET request
    await request(app).get("/api/resumes");

    // POST request triggers clearCache()
    const newResume = {
      title: "New Resume",
      header: { name: "New User", email: "new@example.com" },
    };

    const postRes = await request(app).post("/api/resumes").send(newResume);
    expect(postRes.statusCode).toBe(201);

    // Subsequent GET should reflect fresh data from MongoDB
    const getRes = await request(app).get("/api/resumes");
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(2);
  });
});
```

---

### Benefits of This Setup

1. **Zero External Dependencies**: Tests run isolated in memory using `mongodb-memory-server` and mocked Redis.
2. **Speed**: Eliminates network I/O overhead during test suite execution.
3. **CI Compatibility**: Works out of the box in GitHub Actions without needing service containers during unit test jobs.
   Here is a breakdown of the production-ready MERN stack architecture, test automation suite, CI/CD pipeline, and infrastructure setup we built.

---

## 🏗️ Architecture Overview

```
                        ┌─────────────────────────────────────────┐
                        │             Nginx Frontend              │
                        │     React 18 + Redux Toolkit + Vite     │
                        └────────────────────┬────────────────────┘
                                             │ HTTP / REST
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │            Express Backend              │
                        │    Node.js + Mongoose + Middleware      │
                        └──────────────┬─────────────┬────────────┘
                                       │             │
                             Cache     │             │ MongoDB
                            Hits/Misses│             │ Queries
                                       ▼             ▼
                                ┌──────────┐    ┌──────────┐
                                │  Redis   │    │ MongoDB  │
                                │  Cache   │    │ Database │
                                └──────────┘    └──────────┘

```

---

## 🛠️ Stack Components & Features

### 1. Backend (`/backend`)

- **Core**: Node.js & Express API with RESTful routes for Resume CRUD operations.
- **Database**: MongoDB with Mongoose models (`Resume`, `Experience`, `Education`, `Award`).
- **Validation & Security**: `express-validator` for request payload validation, CORS, `morgan` logging, and global error-handling middleware.
- **Performance & Protection**:
- **Redis Caching**: `cacheMiddleware` caches `GET` responses in Redis and invalidates relevant keys upon `POST`/`PUT`/`DELETE` mutations.
- **Rate Limiting**: `express-rate-limit` backed by `rate-limit-redis` to prevent API abuse.

### 2. Frontend (`/frontend`)

- **Core**: React 18 powered by Vite for rapid development and fast build times.
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`) managing application state (resume customization, section toggling, skill panel updates) and async thunks (`createAsyncThunk`) for backend communication.
- **Styling & UI**: Dynamic live-preview engine with support for multiple resume templates (`modern`, `dark`, `minimal`, `bold`).
- **Production Web Server**: Multi-stage Docker build serving static React production bundles via Nginx Alpine with client-side SPA routing (`try_files`) and Gzip compression.

---

## 🧪 Testing Strategy

| Layer                   | Tool / Library                             | Focus Area                                                                                                        |
| ----------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Backend Integration** | Jest + Supertest + `mongodb-memory-server` | In-memory Mongo integration tests for API routes, validation, and CRUD operations.                                |
| **Backend Unit**        | Jest                                       | Isolated testing for controllers and middlewares with mocked Redis clients.                                       |
| **Frontend Unit**       | Jest + React Testing Library               | Redux slice state reducers, component rendering (`SkillsPanel`, `ResumePreview`), and user events.                |
| **End-to-End (E2E)**    | Playwright (Chromium, Firefox, Mobile)     | Full browser automation covering editing headers, switching templates, responsive design, and network assertions. |
| **Coverage Thresholds** | Jest Configuration                         | Enforces a strict **80% coverage threshold** across statements, branches, functions, and lines.                   |

---

## 🧰 Developer Experience (DevEx) & Git Workflows

- **Husky & lint-staged**:
- **`pre-commit`**: Uses `lint-staged` with `--findRelatedTests` to execute Jest unit tests _only on modified files_ before allowing a commit.
- **`commit-msg`**: Validates commit messages via **Commitlint** to strictly enforce the **Conventional Commits** standard (`feat:`, `fix:`, `docs:`, etc.).
- **`pre-push`**: Executes full test coverage checks before code leaves the local machine.

- **Commitizen (`cz-cli`)**: An interactive terminal UI (`npm run commit`) guiding developers through creating standardized commit messages.

---

## 🚢 Continuous Integration & Continuous Delivery (CI/CD)

The GitHub Actions pipeline (`.github/workflows/ci.yml` & `release.yml`) automates test execution, reporting, and deployment on every pull request and push to `main`:

```
           ┌──────────────────────────────────────────────────┐
           │                  Pull Request                    │
           └────────┬────────────────┬────────────────┬───────┘
                    │                │                │
                    ▼                ▼                ▼
           ┌────────────────┐┌──────────────┐┌────────────────┐
           │ Backend Tests  ││ Frontend Jest││ Playwright E2E │
           │  & Coverage    ││  & Coverage  ││  Browser Tests │
           └───────┬────────┘└──────┬───────┘└───────┬────────┘
                   │                │                │
                   └────────────────┼────────────────┘
                                    ▼
           ┌──────────────────────────────────────────────────┐
           │        Post PR Sticky Comments & Summaries       │
           │  (Backend Coverage + Frontend Coverage + E2E)    │
           └────────────────────────┬─────────────────────────┘
                                    │ On Merge to main
                                    ▼
           ┌──────────────────────────────────────────────────┐
           │                Semantic Release                  │
           │  Auto Version Bump + CHANGELOG.md + GitHub Tag   │
           └────────────────────────┬─────────────────────────┘
                                    │
                                    ▼
           ┌──────────────────────────────────────────────────┐
           │           Deployments & Containers               │
           │ (Vercel CLI / Build & Push Docker Images w/ gha) │
           └──────────────────────────────────────────────────┘

```

1. **Parallel Test Jobs**: Runs backend unit tests, frontend unit tests, and Playwright E2E tests in parallel on isolated Ubuntu runners.
2. **PR Comments**: Uses `jest-coverage-report-action` and `sticky-pull-request-comment` to post expandable code coverage tables and E2E test summaries directly on PR threads.
3. **Automated Releases**: Uses **`semantic-release`** to analyze Conventional Commits, auto-increment semver (`v1.0.1` -> `v1.1.0`), write `CHANGELOG.md`, tag GitHub releases, and publish deployment artifacts.
4. **Build Performance**: Uses Docker Buildx with GitHub Actions caching (`cache-from/to: type=gha,mode=max`) to cache `npm ci` layers between CI runs.

---

## 🐳 Containerization & Local Development

- **Production Orchestration (`docker-compose.yml`)**: Coordinates `mongodb`, `redis`, `backend`, and `frontend` (Nginx) using healthchecks (`service_healthy`) to guarantee startup order.
- **Development Override (`docker-compose.override.yml`)**:
- **Backend**: Mounts local directories into containers using `nodemon` for instant hot-reloading.
- **Frontend**: Runs Vite's HMR dev server on port `5173` with polling support.
- **Mongo Express**: Adds a visual web UI at `http://localhost:8081` to manage database collections.
- **Data Seeding**: Mounts `mongo-init/init.js` to automatically populate sample resumes on fresh volume initialization.

---

### Quick Terminal Command Summary

```bash
# Local Development (Docker + Hot Reloading + Mongo Express)
docker compose up -d --build

# Run Unit Tests locally
cd backend && npm test
cd frontend && npm test

# Run Playwright E2E Tests
cd frontend && npm run test:e2e

# Create a Conventional Commit interactively
git add .
npm run commit

```

What is the best way to handle production secret keys, environment variables, and MongoDB Atlas configuration?

Managing sensitive keys, database connections, and configuration across local environments, CI/CD pipelines, and cloud hosts requires a **defense-in-depth approach**.

Here is the industry-standard blueprint for handling environment variables, MongoDB Atlas, and secrets securely in your MERN stack.

---

## 1. Secret Storage Architecture

Never store production secrets in `.env` files committed to Git or hardcode them in Dockerfiles. Instead, treat environment variables as dynamic runtime injections provided by your cloud host or key management service (KMS).

```
                      ┌─────────────────────────────────┐
                      │    GitHub Secrets / Cloud KMS   │
                      │ (AWS Secrets Mgr, Vercel, Vault)│
                      └────────────────┬────────────────┘
                                       │ Inject at Runtime
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Container / Express Process  │
                      │        (process.env.SECRET)     │
                      └────────────────┴────────────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
          ┌────────────────────┐               ┌───────────────────┐
          │   MongoDB Atlas    │               │  Redis / Services │
          │ (TLS / IP Allowed) │               │   (Auth Token)    │
          └────────────────────┘               └───────────────────┘

```

### Environment Variable Matrix

| Secret / Config | Local Dev (`.env`)           | CI/CD (GitHub Actions)           | Production Host (Render / AWS / Vercel)                  |
| --------------- | ---------------------------- | -------------------------------- | -------------------------------------------------------- |
| `NODE_ENV`      | `development`                | `test`                           | `production`                                             |
| `PORT`          | `5000`                       | `5000`                           | Injected dynamically by host (e.g., `$PORT`)             |
| `MONGO_URI`     | `mongodb://mongodb:27017/db` | `mongodb://localhost:27017/test` | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/prod_db` |
| `REDIS_URL`     | `redis://redis:6379`         | `redis://localhost:6379`         | `rediss://:<token>@redis-host:6379` _(TLS enabled)_      |
| `JWT_SECRET`    | `dev_secret_key`             | `ci_test_secret`                 | High-entropy 256-bit random string                       |

---

## 2. Secure Express Backend Configuration

Use `dotenv` exclusively in development and validate that required environment variables exist at process startup. If a critical secret is missing, crash immediately rather than running in an insecure or broken state.

### `backend/config/env.js` (Environment Schema & Validation)

```javascript
const dotenv = require("dotenv");

// Only load .env file in non-production environments
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

// Enforce required secrets at startup
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ FATAL ERROR: Environment variable ${envVar} is missing.`);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};
```

---

## 3. MongoDB Atlas Hardening Strategy

Connecting to a cloud database like MongoDB Atlas requires specific production security flags:

```
mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/resume_builder_prod?retryWrites=true&w=majority&appName=ResumeBuilder

```

### 1. Connection Code (`backend/config/db.js`)

Ensure production options enforce TLS/SSL and manage connection pools:

```javascript
const mongoose = require("mongoose");
const { MONGO_URI, NODE_ENV } = require("./env");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Production Mongoose 7+ defaults are secure, but connection pool settings help under heavy load
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 2. Atlas Security Best Practices

1. **Dedicated Database User**: Create an Atlas database user with restricted permissions (e.g., `readWrite` strictly on the `resume_builder_prod` database). Never use the Atlas account admin user.
2. **IP Access List**:

- **Best**: If using a cloud provider with static outgoing IPs (e.g., AWS Elastic IP, Render Static Outbound IP), add those specific IPs to the Atlas Network Access list.
- **Alternative**: If deploying on serverless platforms with dynamic IPs (e.g., Vercel, AWS Lambda), allow `0.0.0.0/0` in Atlas **ONLY** when paired with strong password authentication and TLS/SSL enforcement.

3. **Database Special Characters**: If your database password contains special characters (`@`, `:`, `/`, `%`), ensure it is URL-encoded before inserting it into the `MONGO_URI` (e.g., `@` becomes `%40`).

---

## 4. Handling React Frontend Build Variables

Vite exposes environment variables starting with `VITE_` at compile time.

> **Critical Warning:** Any variable prefixed with `VITE_` is baked into public client-side JavaScript bundles. **Never put API secrets, JWT private keys, or database credentials in frontend environment variables.**

### `frontend/Dockerfile` Injection

Pass non-sensitive configuration (like backend API endpoints) using Docker build arguments:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Accept build arguments passed during docker build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

```

Pass the production URL during build execution:

```bash
docker build --build-arg VITE_API_URL=https://api.yourdomain.com -t resume-frontend .

```

---

## 5. Secret Injection across Platforms

### 1. GitHub Actions (CI/CD)

Store keys under **Settings** → **Secrets and variables** → **Actions** → **Repository secrets**.

```yaml
- name: Run Integration Tests
  env:
    MONGO_URI: ${{ secrets.PROD_MONGO_URI }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
  run: npm test
```

### 2. Production Hosting Platforms

- **Render / Railway / Heroku**: Use the platform dashboard's **Environment Variables** section to define `MONGO_URI`, `REDIS_URL`, and `JWT_SECRET`.
- **AWS ECS / Docker Swarm / Kubernetes**: Use **AWS Secrets Manager** or **Kubernetes Secrets** and inject them as environment variables into task definitions/pods.
- **Vercel (Frontend)**: Define `VITE_API_URL` under **Project Settings** → **Environment Variables** for `Production` and `Preview` environments.

---

## 6. Pre-Commit Secret Scanning Safety Net

Add **`git-secrets`** or **`gitleaks`** to your local Husky hooks to prevent accidentally committing secrets or `.env` files:

```bash
# Install gitleaks via Homebrew or npm
npm install --save-dev gitleaks

```

Add a gitleaks check to your `.husky/pre-commit` hook:

```bash
#!/bin/sh
npx lint-staged
npx gitleaks protect --staged --verbose

```

And ensure your `.gitignore` contains:

```gitignore
.env
.env.local
.env.production
*.pem
*.key

```

How can I configure a MongoDB service container in GitHub Actions to test with a real database instead of memory-server?

Using a real **MongoDB service container** in GitHub Actions allows your integration tests to run against an authentic MongoDB instance rather than relying on in-memory mocks like `mongodb-memory-server`.

GitHub Actions provides native support for service containers, launching them alongside your runner on the same virtual network.

---

### Step 1: Update Your GitHub Actions Workflow

In your `.github/workflows/ci.yml` file, add a `services` block to your `backend-test` job. This boots a MongoDB container in the background before running your test steps.

```yaml
name: MERN Stack Continuous Integration

on:
  pull_request:
    branches: [main, master, develop]
  push:
    branches: [main, master]

jobs:
  # ------------------------------------------------------------------
  # Backend Tests with Real MongoDB Service Container
  # ------------------------------------------------------------------
  backend-test:
    name: Backend Tests (Real MongoDB)
    runs-on: ubuntu-latest

    # 1. Define the MongoDB Service Container
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
        options: >-
          --health-cmd "echo 'db.runCommand(\"ping\").ok' | mongosh localhost:27017/test --quiet"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: backend/package-lock.json

      - name: Install Dependencies
        run: npm ci

      # 2. Run Backend Tests pointing to localhost:27017
      - name: Run Backend Tests
        run: npm test
        env:
          NODE_ENV: test
          PORT: 5000
          MONGO_URI: mongodb://localhost:27017/ci_test_db
          JWT_SECRET: ci_test_secret_key
```

---

### Step 2: Make Your Backend Tests DB-Agnostic

Update your test setup (e.g., `backend/tests/resume.test.js` or `backend/tests/setup.js`) to conditionally connect to the `MONGO_URI` environment variable if provided, rather than forcing `MongoMemoryServer` when running in CI.

#### Example Update: `backend/tests/resume.test.js`

```javascript
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Resume = require("../models/Resume");

let mongoServer;

beforeAll(async () => {
  // If MONGO_URI is set (like in GitHub Actions CI), connect directly to the service container
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
  } else {
    // Fallback to MongoMemoryServer for fast local offline testing
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  // Only stop memory server if it was initialized locally
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Clean up collection state between test runs
  await Resume.deleteMany({});
});

describe("GET /api/resumes", () => {
  it("should return empty array when no resumes exist", async () => {
    const res = await request(app).get("/api/resumes");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });
});
```

---

### Key Workflow Highlights

1. **Port Mapping (`27017:27017`)**: Maps port `27017` inside the MongoDB service container directly to `localhost:27017` on the host runner VM where your Node.js steps execute.
2. **Health Check (`mongosh ping`)**: Uses MongoDB's `mongosh` utility to ensure the database process is healthy and ready to accept TCP socket connections before GitHub Actions proceeds to the `steps` section.
3. **Hybrid Setup**: Allows developers to run tests locally offline using `mongodb-memory-server` without needing Docker running, while CI runs against a real MongoDB 6.0 engine.
