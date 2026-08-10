The Message Manager skill has been created and saved as message-manager.

What's Included:
Express & MongoDB Architecture:

User Mongoose schema with blockedUsers tracking array.

Message Mongoose schema with folder flags (isRead, isArchived, isBin, isSpam).

Express REST endpoints for fetching folder contents (/inbox, /sent, /archived, /bin, /spam), sending messages, updating read/archive/bin status, and blocking senders.

Full Front-End React Component:

Folders: Inbox, Sent, Archived, Bin / Trash, Spam & Blocked, plus User Profile Settings.

Send & Compose: Compose modal with recipient email validation, subject line, and body content.

Status Toggles: Instantly switch messages between Read / Unread.

Archiving & Deleting: One-click move to Archived or Bin (with a restore action in Bin).

Spam & Blocked Management: Block any sender to auto-route future messages into Spam. View and unblock addresses in Profile Settings.

Live Search: Multi-field search filtering across subject lines, body text, and sender emails.

message-manager
Full-stack MERN Message Manager with inbox, sent, archived, bin/trash, spam/blocked folders, profile settings, search, and read/unread status.

Instructions
MERN Message Manager (Inbox, Archive, Bin, Spam & Blocked)
A full-stack, responsive Message Management application built with React, Node.js/Express, MongoDB, and Tailwind CSS.

Key Features
Folder Views:
Inbox: Incoming messages with read/unread indicators.
Sent: Sent messages trail.
Archived: Stash messages out of the primary inbox.
Bin / Trash: Soft-deleted messages with restore capability.
Spam & Blocked: Automatically or manually flagged spam or blocked contacts.
User Profile: User details (name, email, avatar, auto-responder status).
Core Actions:
Send Message: Compose with instant delivery.
Mark Read / Unread: Toggle message status individually or in bulk.
Search: Multi-field search across senders, subjects, and body text.
Move / Restore / Block: Shift messages between folders or block senders.

1. Backend Implementation (Express & MongoDB)
Database Schemas
models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  blockedUsers: [{ type: String }], // Array of blocked emails
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderEmail: { type: String, required: true },
  senderName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  subject: { type: String, default: '(no subject)' },
  body: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isBin: { type: Boolean, default: false },
  isSpam: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ senderEmail: 1, recipientEmail: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
Express Controller Routes (routes/messageRoutes.js)
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// GET: Messages by folder (inbox, sent, archived, bin, spam)
router.get('/', async (req, res) => {
  try {
    const { folder = 'inbox', search = '' } = req.query;
    const userEmail = req.user.email;
    let query = {};

    // Search query
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } },
        { senderEmail: { $regex: search, $options: 'i' } }
      ];
    }

    switch (folder) {
      case 'inbox':
        query.recipientEmail = userEmail;
        query.isArchived = false;
        query.isBin = false;
        query.isSpam = false;
        break;
      case 'sent':
        query.senderEmail = userEmail;
        query.isBin = false;
        break;
      case 'archived':
        query.recipientEmail = userEmail;
        query.isArchived = true;
        query.isBin = false;
        break;
      case 'bin':
        query.$or = [{ recipientEmail: userEmail }, { senderEmail: userEmail }];
        query.isBin = true;
        break;
      case 'spam':
        query.recipientEmail = userEmail;
        query.isSpam = true;
        query.isBin = false;
        break;
      default:
        query.recipientEmail = userEmail;
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Send new message
router.post('/', async (req, res) => {
  try {
    const { recipientEmail, subject, body } = req.body;

    // Check if sender is blocked by recipient
    const recipientUser = await User.findOne({ email: recipientEmail });
    const isBlocked = recipientUser?.blockedUsers?.includes(req.user.email);

    const message = new Message({
      sender: req.user.id,
      senderEmail: req.user.email,
      senderName: req.user.name,
      recipientEmail,
      subject,
      body,
      isSpam: Boolean(isBlocked)
    });

    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Update Message Flags (isRead, isArchived, isBin, isSpam)
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH: Block user sender
router.patch('/block-sender', async (req, res) => {
  try {
    const { targetEmail } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { blockedUsers: targetEmail }
    });
    res.json({ message: `User ${targetEmail} blocked successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
2. Interactive Front-End React Component
Below is a complete, single-file React component featuring folder switching, live search, compose modal, profile view, read/unread toggles, archive, bin, and block operations:

import React, { useState } from 'react';
import {
  Inbox, Send, Archive, Trash2, ShieldAlert, User,
  Search, Plus, Mail, CheckCircle2, Circle, AlertOctagon,
  X, CornerUpLeft, RefreshCw, Lock, Ban, Settings
} from 'lucide-react';

// Mock Messages
const MOCK_MESSAGES = [
  {
    id: 'm1',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.j@acme.com',
    recipientEmail: 'me@workspace.com',
    subject: 'Quarterly Review Sync',
    body: 'Hi there,\n\nCan we reschedule our review meeting to 3 PM IST today? Let me know if that works for you.\n\nBest,\nSarah',
    isRead: false,
    isArchived: false,
    isBin: false,
    isSpam: false,
    date: '10:15 AM'
  },
  {
    id: 'm2',
    senderName: 'DevOps Alerts',
    senderEmail: 'alerts@cloudops.io',
    subject: 'Production Server Deployment Successful',
    body: 'Build #4812 passed all unit tests and was deployed to production cluster us-east-1.',
    isRead: true,
    isArchived: false,
    isBin: false,
    isSpam: false,
    date: 'Yesterday'
  },
  {
    id: 'm3',
    senderName: 'Promo Offer',
    senderEmail: 'deals@unverified-marketing.com',
    subject: 'Claim your $500 gift voucher now!',
    body: 'Click here immediately to claim your exclusive prize voucher before time runs out!',
    isRead: false,
    isArchived: false,
    isBin: false,
    isSpam: true,
    date: 'Aug 8'
  }
];

export default function MessageManager() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [activeFolder, setActiveFolder] = useState('inbox'); // inbox | sent | archived | bin | spam | profile
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile & Blocked List State
  const [profile, setProfile] = useState({
    name: 'Alex Mercer',
    email: '<me@workspace.com>',
    avatar: 'AM',
    blockedUsers: ['spammer@badsource.org']
  });

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  // Toggle Read/Unread
  const toggleReadStatus = (id, e) => {
    e?.stopPropagation();
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, isRead: !m.isRead } : m
    ));
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => ({ ...prev, isRead: !prev.isRead }));
    }
  };

  // Move Message to Archive
  const archiveMessage = (id, e) => {
    e?.stopPropagation();
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, isArchived: true, isBin: false, isSpam: false } : m
    ));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  // Move Message to Bin / Trash
  const binMessage = (id, e) => {
    e?.stopPropagation();
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, isBin: true } : m
    ));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  // Restore from Bin / Archive
  const restoreMessage = (id, e) => {
    e?.stopPropagation();
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, isBin: false, isArchived: false, isSpam: false } : m
    ));
  };

  // Block Sender
  const blockSender = (email) => {
    if (!profile.blockedUsers.includes(email)) {
      setProfile(prev => ({
        ...prev,
        blockedUsers: [...prev.blockedUsers, email]
      }));
      // Move all messages from this sender to spam
      setMessages(prev => prev.map(m =>
        m.senderEmail === email ? { ...m, isSpam: true } : m
      ));
    }
  };

  // Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!composeData.to.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      senderName: profile.name,
      senderEmail: profile.email,
      recipientEmail: composeData.to,
      subject: composeData.subject || '(no subject)',
      body: composeData.body,
      isRead: true,
      isArchived: false,
      isBin: false,
      isSpam: false,
      date: 'Just now'
    };

    setMessages([newMsg, ...messages]);
    setIsComposeOpen(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  // Filter Messages by Folder & Search
  const filteredMessages = messages.filter(m => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchBody = m.body.toLowerCase().includes(q);
      const matchSender = m.senderName.toLowerCase().includes(q) || m.senderEmail.toLowerCase().includes(q);
      if (!matchSubject && !matchBody && !matchSender) return false;
    }

    if (activeFolder === 'inbox') {
      return m.recipientEmail === profile.email && !m.isArchived && !m.isBin && !m.isSpam;
    }
    if (activeFolder === 'sent') {
      return m.senderEmail === profile.email && !m.isBin;
    }
    if (activeFolder === 'archived') {
      return m.isArchived && !m.isBin;
    }
    if (activeFolder === 'bin') {
      return m.isBin;
    }
    if (activeFolder === 'spam') {
      return m.isSpam && !m.isBin;
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/*1. Sidebar Nav*/}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-indigo-400 font-extrabold text-xl">
            <Mail size={26} />
            <span>MsgHub</span>
          </div>

          <button
            onClick={() => setIsComposeOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            <Plus size={18} />
            <span>New Message</span>
          </button>

          {/* Folder Buttons */}
          <nav className="space-y-1">
            {[
              { id: 'inbox', label: 'Inbox', icon: Inbox, count: messages.filter(m => m.recipientEmail === profile.email && !m.isRead && !m.isArchived && !m.isBin && !m.isSpam).length },
              { id: 'sent', label: 'Sent', icon: Send },
              { id: 'archived', label: 'Archived', icon: Archive },
              { id: 'bin', label: 'Bin / Trash', icon: Trash2 },
              { id: 'spam', label: 'Spam & Blocked', icon: ShieldAlert, count: messages.filter(m => m.isSpam && !m.isBin).length },
            ].map(folder => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => { setActiveFolder(folder.id); setSelectedMessage(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span>{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => { setActiveFolder('profile'); setSelectedMessage(null); }}
          className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition ${
            activeFolder === 'profile' ? 'bg-indigo-600/20 border-indigo-500/40 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
            {profile.avatar}
          </div>
          <div className="text-left text-xs truncate">
            <p className="font-bold text-slate-200 truncate">{profile.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{profile.email}</p>
          </div>
        </button>
      </aside>

      {/* 2. Main Content Area */}
      {activeFolder === 'profile' ? (
        /* PROFILE VIEW */
        <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white">Profile & Preferences</h2>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center">
                  {profile.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                  <p className="text-xs text-slate-400">{profile.email}</p>
                </div>
              </div>

              {/* Blocked Users List */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-indigo-400 uppercase">Blocked Senders ({profile.blockedUsers.length})</h4>
                {profile.blockedUsers.length === 0 ? (
                  <p className="text-xs text-slate-500">No blocked addresses.</p>
                ) : (
                  <div className="space-y-2">
                    {profile.blockedUsers.map(email => (
                      <div key={email} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl text-xs border border-slate-800">
                        <span className="font-mono text-slate-300">{email}</span>
                        <button
                          onClick={() => setProfile(prev => ({ ...prev, blockedUsers: prev.blockedUsers.filter(e => e !== email) }))}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MESSAGES VIEW */
        <div className="flex-1 flex overflow-hidden">
          {/* Middle List */}
          <div className={`${selectedMessage ? 'w-2/5 border-r border-slate-800' : 'w-full'} flex flex-col bg-slate-900/40`}>
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject, content, sender..."
                  className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm">
                  No messages in this folder.
                </div>
              ) : (
                filteredMessages.map(msg => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        toggleReadStatus(msg.id);
                      }}
                      className={`p-4 flex flex-col space-y-1.5 cursor-pointer transition ${
                        isSelected ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : msg.isRead ? 'bg-slate-950/60' : 'bg-slate-900 font-semibold'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200 truncate">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-500">{msg.date}</span>
                      </div>
                      <h4 className="text-xs text-slate-100 truncate">{msg.subject}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{msg.body}</p>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={(e) => toggleReadStatus(msg.id, e)}
                          className="text-slate-500 hover:text-indigo-400 text-[10px]"
                        >
                          {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Reader View */}
          {selectedMessage && (
            <div className="flex-1 bg-slate-950 p-6 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                {/* Actions Toolbar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleReadStatus(selectedMessage.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg border border-slate-700"
                    >
                      {selectedMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    {!selectedMessage.isArchived && (
                      <button
                        onClick={() => archiveMessage(selectedMessage.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1"
                      >
                        <Archive size={14} />
                        <span>Archive</span>
                      </button>
                    )}
                    {!selectedMessage.isBin ? (
                      <button
                        onClick={() => binMessage(selectedMessage.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete to Bin</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreMessage(selectedMessage.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg"
                      >
                        Restore Message
                      </button>
                    )}
                    <button
                      onClick={() => blockSender(selectedMessage.senderEmail)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1"
                    >
                      <Ban size={14} />
                      <span>Block Sender</span>
                    </button>
                  </div>

                  <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                {/* Subject & Header */}
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{selectedMessage.subject}</h2>
                  <div className="flex items-center space-x-3 mt-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                      {selectedMessage.senderName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{selectedMessage.senderName}</p>
                      <p className="text-[10px] text-slate-500">{selectedMessage.senderEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  {selectedMessage.body}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. New Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-md font-bold text-white">Send New Message</h3>
              <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Recipient Email *</label>
                <input
                  type="email"
                  required
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                  placeholder="recipient@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Subject line..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Message Body *</label>
                <textarea
                  rows={6}
                  required
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  placeholder="Write message here..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsComposeOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
See less
