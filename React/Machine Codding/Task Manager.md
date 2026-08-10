The **Task Manager** skill has been created and saved as `task-manager`.

### What's Included

1. **Express & MongoDB Architecture**:

* `TaskList` Mongoose schema for custom categories (*Work*, *Personal*, *Project Alpha*, etc.).
* `Task` Mongoose schema with `deadline`, `priority`, `status` (`Pending`/`Completed`), `isFavorite`, and `listName`.
* Express REST endpoints supporting Today/Tomorrow date query logic, completion status filtering, custom list filtering, favorites filtering, and dynamic multi-column sorting (`deadline`, `title`, `status`).

1. **Full Front-End React Component**:

* **Custom Task Lists**: Modal to create new task categories dynamically, plus sidebar filtering by list.
* **Quick Date Tabs**: `Today`, `Tomorrow`, `Starred Tasks`, and `All Tasks`.
* **Multi-Criteria Sorting & Filtering**:
* Sort tasks by **Deadline**, **Title (A-Z)**, or **Completion Status** (ASC / DESC).
* Filter tasks by status (`ALL`, `Pending`, `Completed`).

* **Interactive Task Actions**:
* Checkbox toggle for completion (applies line-through effect & opacity transition).
* Star button toggle for favorite pinning.
* New task creation modal with date/time pickers and priority settings.

task-manager
Full-stack MERN Task Manager with custom Task Lists, Today/Tomorrow tabs, multi-column sorting (deadline, title, status), favorites, and task completion filters.

Instructions
Task Manager Application (MERN Stack)
A complete, production-ready full-stack Task Management application built with React, Node.js/Express, MongoDB, and Tailwind CSS.

Key Features
Custom Task Lists: Organize tasks under custom lists (e.g., Work, Personal, Project Alpha).
Date Quick Tabs:
Today: Instant filter for tasks due today.
Tomorrow: Instant filter for tasks due tomorrow.
All Tasks / Upcoming: Comprehensive schedule view.
Multi-Criteria Sorting & Filtering:
Sort by Deadline (Due date ascending/descending).
Sort by Title (Alphabetical A-Z).
Sort by Completion Status (Pending first vs. Completed first).
Filter by Completion Status (ALL, COMPLETED, PENDING).
Filter by Favorites / Starred tasks.
Rich Task Options: Title, Description, Deadline Date & Time, Priority (Low, Medium, High), Custom List Category, Favorite Toggle, and Completion Toggle.

1. Backend Implementation (Express & MongoDB)
Database Schemas
models/TaskList.js
const mongoose = require('mongoose');

const taskListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#6366f1' }, // Default hex color
}, { timestamps: true });

module.exports = mongoose.model('TaskList', taskListSchema);
models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  isFavorite: { type: Boolean, default: false },
  listName: { type: String, default: 'General' }, // Maps to TaskList
}, { timestamps: true });

taskSchema.index({ user: 1, deadline: 1, status: 1, isFavorite: 1 });

module.exports = mongoose.model('Task', taskSchema);
Express Controller Routes (routes/taskRoutes.js)
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskList = require('../models/TaskList');

// GET: Fetch tasks with tab, filter, and sorting options
router.get('/', async (req, res) => {
  try {
    const { tab, status, listName, favorite, sortBy, sortOrder = 'asc', search } = req.query;
    let query = { user: req.user.id };

    // 1. Tab Date Filtering
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const tomorrowStart = new Date(todayEnd);
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    if (tab === 'today') {
      query.deadline = { $gte: todayStart, $lt: todayEnd };
    } else if (tab === 'tomorrow') {
      query.deadline = { $gte: tomorrowStart, $lt: tomorrowEnd };
    }

    // 2. Status Filter (ALL / Pending / Completed)
    if (status && status !== 'ALL') {
      query.status = status;
    }

    // 3. List Filter
    if (listName && listName !== 'ALL') {
      query.listName = listName;
    }

    // 4. Favorites Filter
    if (favorite === 'true') {
      query.isFavorite = true;
    }

    // 5. Search Filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 6. Dynamic Sorting
    let sortObj = {};
    if (sortBy === 'deadline') {
      sortObj.deadline = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'title') {
      sortObj.title = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'status') {
      sortObj.status = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortObj.deadline = 1; // Default
    }

    const tasks = await Task.find(query).sort(sortObj);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create Task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, user: req.user.id });
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Toggle Completion / Favorite Status
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Remove Task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
2. Interactive Front-End React Component
Below is a complete, single-file React component featuring custom Task Lists, Today/Tomorrow tabs, sorting options (by deadline, title, or completion status), favorites, and a new task modal:

import React, { useState } from 'react';
import {
  CheckCircle2, Circle, Calendar, Star, Clock, Plus,
  ListTodo, Filter, ArrowUpDown, Trash2, Search, X,
  Sun, Sunset, CheckSquare, Layers
} from 'lucide-react';

// Helpers for Today / Tomorrow ISO Strings
const todayStr = new Date().toISOString().split['T'](0);
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowStr = tomorrowDate.toISOString().split['T'](0);

const MOCK_TASKS = [
  {
    id: 't1',
    title: 'Review Q3 Engineering Roadmap',
    description: 'Go through sprint goals and allocate resources for frontend rewrite.',
    deadline: `${todayStr}T17:00`,
    priority: 'High',
    status: 'Pending',
    isFavorite: true,
    listName: 'Work'
  },
  {
    id: 't2',
    title: 'Buy groceries & weekly meal prep',
    description: 'Get fresh vegetables, almond milk, and chicken breast.',
    deadline: `${todayStr}T20:00`,
    priority: 'Medium',
    status: 'Completed',
    isFavorite: false,
    listName: 'Personal'
  },
  {
    id: 't3',
    title: 'Client Demo Presentation',
    description: 'Prepare Figma slides and check backend deployment API routes.',
    deadline: `${tomorrowStr}T11:00`,
    priority: 'High',
    status: 'Pending',
    isFavorite: true,
    listName: 'Work'
  },
  {
    id: 't4',
    title: 'Schedule dentist appointment',
    description: 'Call Dr. Smith for routine cleaning.',
    deadline: `${tomorrowStr}T15:00`,
    priority: 'Low',
    status: 'Pending',
    isFavorite: false,
    listName: 'Health'
  }
];

export default function TaskManager() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [taskLists, setTaskLists] = useState(['General', 'Work', 'Personal', 'Health']);

  // Filters & Tabs State
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | TODAY | TOMORROW | FAVORITES
  const [selectedList, setSelectedList] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | Pending | Completed
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting State
  const [sortBy, setSortBy] = useState('deadline'); // deadline | title | status
  const [sortOrder, setSortOrder] = useState('asc'); // asc | desc

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [newListInput, setNewListInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadlineDate: todayStr,
    deadlineTime: '12:00',
    priority: 'Medium',
    listName: 'General',
    isFavorite: false
  });

  // Toggle Task Completion
  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t
    ));
  };

  // Toggle Favorite Status
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  // Delete Task
  const deleteTask = (id, e) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Create Task List
  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListInput.trim() || taskLists.includes(newListInput.trim())) return;
    setTaskLists([...taskLists, newListInput.trim()]);
    setSelectedList(newListInput.trim());
    setNewListInput('');
    setIsNewListModalOpen(false);
  };

  // Create Task
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask = {
      id: `t_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      deadline: `${formData.deadlineDate}T${formData.deadlineTime}`,
      priority: formData.priority,
      status: 'Pending',
      isFavorite: formData.isFavorite,
      listName: formData.listName
    };

    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      deadlineDate: todayStr,
      deadlineTime: '12:00',
      priority: 'Medium',
      listName: 'General',
      isFavorite: false
    });
  };

  // Filtering Logic
  const filteredTasks = tasks.filter(t => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // List Filter
    if (selectedList !== 'ALL' && t.listName !== selectedList) return false;

    // Status Filter
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

    // Date Tabs & Favorites
    const taskDateStr = t.deadline.split('T')[0];
    if (activeTab === 'TODAY' && taskDateStr !== todayStr) return false;
    if (activeTab === 'TOMORROW' && taskDateStr !== tomorrowStr) return false;
    if (activeTab === 'FAVORITES' && !t.isFavorite) return false;

    return true;
  });

  // Sorting Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'deadline') {
      comparison = new Date(a.deadline) - new Date(b.deadline);
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/*1. Left Sidebar Navigation*/}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-indigo-400 font-extrabold text-xl">
            <ListTodo size={26} />
            <span>TaskWorkspace</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            <Plus size={18} />
            <span>Add New Task</span>
          </button>

          {/* Quick Tabs */}
          <nav className="space-y-1">
            {[
              { id: 'ALL', label: 'All Tasks', icon: Layers, count: tasks.length },
              { id: 'TODAY', label: 'Today', icon: Sun, count: tasks.filter(t => t.deadline.split('T')[0] === todayStr).length },
              { id: 'TOMORROW', label: 'Tomorrow', icon: Sunset, count: tasks.filter(t => t.deadline.split('T')[0] === tomorrowStr).length },
              { id: 'FAVORITES', label: 'Starred Tasks', icon: Star, count: tasks.filter(t => t.isFavorite).length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-300">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Task Lists Section */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Task Lists</span>
              <button
                onClick={() => setIsNewListModalOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1"
              >
                <Plus size={14} /> New List
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedList('ALL')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedList === 'ALL' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Lists
              </button>
              {taskLists.map(list => (
                <button
                  key={list}
                  onClick={() => setSelectedList(list)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                    selectedList === list ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{list}</span>
                  <span className="text-[10px] text-slate-600 font-bold">
                    {tasks.filter(t => t.listName === list).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Workspace */}
      <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {/* Top Filter & Sorting Toolbar */}
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/40">
          {/* Search Input */}
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Sorting & Completion Filter Controls */}
          <div className="flex items-center space-x-4 text-xs">
            {/* Filter by Completion Status */}
            <div className="flex items-center space-x-2">
              <Filter size={14} className="text-slate-500" />
              <span className="text-slate-400 font-bold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Sort Criteria */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown size={14} className="text-slate-500" />
              <span className="text-slate-400 font-bold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-slate-200 focus:outline-none"
              >
                <option value="deadline">Deadline</option>
                <option value="title">Title (A-Z)</option>
                <option value="status">Completion Status</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg font-bold text-slate-300 hover:text-white"
              >
                {sortOrder.toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        {/* Task Cards Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {sortedTasks.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No tasks found for your current filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTasks.map(task => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between transition-all space-y-3 ${
                      isCompleted ? 'border-slate-800/80 opacity-60' : 'border-slate-800 shadow-md hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                          {task.listName}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => toggleFavorite(task.id, e)}
                            className="p-1 text-slate-500 hover:text-amber-400"
                          >
                            <Star size={16} className={task.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
                          </button>
                          <button
                            onClick={(e) => deleteTask(task.id, e)}
                            className="p-1 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Title & Checkbox */}
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className="mt-1 text-slate-400 hover:text-indigo-400 transition"
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={18} className="text-green-500" />
                          ) : (
                            <Circle size={18} />
                          )}
                        </button>
                        <div>
                          <h3 className={`font-bold text-sm text-slate-100 ${isCompleted && 'line-through text-slate-500'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer: Priority & Deadline */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority} Priority
                      </span>

                      <div className="flex items-center gap-1 font-mono">
                        <Clock size={12} className="text-indigo-400" />
                        <span>{new Date(task.deadline).toLocaleDateString()} {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 3. Modal: Add New Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-md font-bold text-white">Create New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Prepare quarterly financial report"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details, links, or notes..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Deadline & List */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={formData.deadlineDate}
                    onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Deadline Time</label>
                  <input
                    type="time"
                    required
                    value={formData.deadlineTime}
                    onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              {/* Priority & List */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Task List</label>
                  <select
                    value={formData.listName}
                    onChange={(e) => setFormData({ ...formData, listName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100"
                  >
                    {taskLists.map(list => (
                      <option key={list} value={list}>{list}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Favorite Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="favTask"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600"
                />
                <label htmlFor="favTask" className="text-slate-300 font-bold">Star / Mark as Favorite</label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Create Custom Task List */}
      {isNewListModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-md font-bold text-white">Create Task List</h3>
              <button onClick={() => setIsNewListModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={newListInput}
                  onChange={(e) => setNewListInput(e.target.value)}
                  placeholder="e.g., Marketing Campaign"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsNewListModalOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md">
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
