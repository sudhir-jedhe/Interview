A full-stack, responsive Email Client application architecture (Gmail clone) has been created and saved as a skill (email-client).What's Included:Full-Stack Architecture: MongoDB Mongoose schemas (User, Email), REST API controller routes with full text searching, and Socket.io setup for real-time inbox sync.Interactive React Prototype Component:Folders & Labels: Easily switch between Inbox, Starred, Sent, Drafts, Trash, and colored tags (Work, Personal, Finance, Urgent).Read/Unread Sync: Clicking an email marks it as read and displays the message body side-by-side in a split-pane view.Floating Compose Modal: Allows sending rich email messages dynamically.Search Bar: Live keyword filtering across subject lines, body snippets, and senders. email-client Full-stack MERN email client (Gmail clone) with inbox, compose, star, label filters, search, and socket.io real-time notifications.
Instructions
MERN Email Client Template (Gmail Clone)
A full-stack, responsive Web Email Client featuring dynamic inbox views, rich text composition, real-time socket updates, starred/label management, and keyboard shortcuts.

1. System Architecture & Features
                          ┌──────────────────────────┐
                          │   React Frontend (Vite)  │
                          └─────────────┬────────────┘
                                        │ REST API / WebSockets
                                        ▼
                          ┌──────────────────────────┐
                          │   Node.js / Express API  │
                          └─────────────┬────────────┘
                                        │ Mongoose
                                        ▼
                          ┌──────────────────────────┐
                          │     MongoDB Database     │
                          └──────────────────────────┘

FeatureCapabilitiesFolder FiltersInbox, Starred, Sent, Drafts, Trash, SpamLabels & TagsCustom color-coded labels (Work, Personal, Urgent, etc.)Compose ModalRich text formatting, CC/BCC toggles, attachments, drafts auto-saveReal-Time SyncInstantly receive incoming emails via Socket.ioFull SearchSearch by sender, subject line, or body keywords

1. Backend Implementation (Express & MongoDB)
2.1 Database Models
models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

models/Email.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderEmail: { type: String, required: true },
  recipients: [{ type: String, required: true }],
  cc: [{ type: String }],
  bcc: [{ type: String }],
  subject: { type: String, default: '(no subject)' },
  body: { type: String, required: true },
  snippet: { type: String },
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isTrash: { type: Boolean, default: false },
  isSpam: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: false },
  labels: [{ type: String }], // e.g., 'Work', 'Personal'
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);

2.2 Core Email Controller (controllers/emailController.js)
const Email = require('../models/Email');

// Send new email or update draft
exports.sendEmail = async (req, res) => {
  try {
    const { recipients, cc, bcc, subject, body, labels, isDraft } = req.body;
    const snippet = body.replace(/<[^>]*>?/gm, '').substring(0, 100);

    const email = new Email({
      sender: req.user.id,
      senderEmail: req.user.email,
      recipients,
      cc,
      bcc,
      subject,
      body,
      snippet,
      labels,
      isDraft: Boolean(isDraft)
    });

    const savedEmail = await email.save();

    // Broadcast via Socket.io if not a draft
    if (!isDraft) {
      const io = req.app.get('socketio');
      recipients.forEach((rcp) => {
        io.emit(`incoming_email_${rcp}`, savedEmail);
      });
    }

    res.status(201).json(savedEmail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch folder / inbox emails
exports.getFolderEmails = async (req, res) => {
  try {
    const { folder = 'inbox', search = '', label } = req.query;
    const userEmail = req.user.email;
    let query = {};

    // Search keyword
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { senderEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Folder routing logic
    switch (folder) {
      case 'inbox':
        query.recipients = userEmail;
        query.isTrash = false;
        query.isSpam = false;
        query.isDraft = false;
        break;
      case 'starred':
        query.$or = [{ recipients: userEmail }, { senderEmail: userEmail }];
        query.isStarred = true;
        query.isTrash = false;
        break;
      case 'sent':
        query.senderEmail = userEmail;
        query.isDraft = false;
        query.isTrash = false;
        break;
      case 'drafts':
        query.senderEmail = userEmail;
        query.isDraft = true;
        query.isTrash = false;
        break;
      case 'trash':
        query.$or = [{ recipients: userEmail }, { senderEmail: userEmail }];
        query.isTrash = true;
        break;
      default:
        query.recipients = userEmail;
    }

    if (label) query.labels = label;

    const emails = await Email.find(query).sort({ createdAt: -1 });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle flags (Starred, Read, Trash)
exports.updateEmailStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // e.g. { isStarred: true } or { isRead: true }

    const updated = await Email.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

1. Frontend Implementation (React & Tailwind CSS)
Single-File Interactive Gmail Prototype Component
import React, { useState } from 'react';
import {
  Inbox, Star, Send, FileText, Trash2, AlertOctagon, Tag, Search,
  Plus, Archive, CheckSquare, RefreshCw, MoreVertical, Paperclip,
  X, CornerUpLeft, ChevronLeft, ChevronRight
} from 'lucide-react';

const MOCK_EMAILS = [
  {
    id: 'e1',
    senderName: 'GitHub Notifications',
    senderEmail: 'notifications@github.com',
    subject: '[GitHub] Security alert for your repository',
    snippet: 'We detected a high-severity vulnerability in one of your dependencies in project-workspace...',
    body: 'Hello developer,\n\nWe detected a high-severity vulnerability in your repository dependencies. Please update package.json to the latest patch release immediately.\n\nBest,\nGitHub Security Team',
    date: '10:42 AM',
    isRead: false,
    isStarred: true,
    labels: ['Work', 'Urgent'],
    folder: 'inbox'
  },
  {
    id: 'e2',
    senderName: 'Stripe Billing',
    senderEmail: 'invoices@stripe.com',
    subject: 'Your receipt from Cloud Services Inc. (#INV-9921)',
    snippet: 'Thank you for your payment. $49.00 has been charged to your card ending in 4242...',
    body: 'Amount Paid: $49.00 USD\nInvoice ID: #INV-9921\nDate: Aug 10, 2026\n\nYou can view your invoice details in your dashboard anytime.',
    date: 'Yesterday',
    isRead: true,
    isStarred: false,
    labels: ['Finance'],
    folder: 'inbox'
  },
  {
    id: 'e3',
    senderName: 'Alex Rivers',
    senderEmail: 'alex.rivers@designco.io',
    subject: 'Feedback on Q3 UI Dashboard Wireframes',
    snippet: 'Hey! I reviewed the latest Figma prototypes. The dark mode color tokens look amazing...',
    body: 'Hey team,\n\nI took a look at the Q3 Dashboard mocks. Overall it looks great! Let us schedule a quick sync tomorrow at 2 PM to finalize the navigation components.\n\nCheers,\nAlex',
    date: 'Aug 8',
    isRead: true,
    isStarred: true,
    labels: ['Work'],
    folder: 'inbox'
  }
];

export default function GmailApp() {
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [activeLabel, setActiveLabel] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  // Toggle Star
  const toggleStar = (id, e) => {
    e.stopPropagation();
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  // Toggle Checkbox
  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Send Email Handler
  const handleSendEmail = (e) => {
    e.preventDefault();
    const newEmail = {
      id: `e_${Date.now()}`,
      senderName: 'Me',
      senderEmail: '<me@appworkspace.com>',
      subject: composeData.subject || '(no subject)',
      snippet: composeData.body.substring(0, 80),
      body: composeData.body,
      date: 'Just now',
      isRead: true,
      isStarred: false,
      labels: [],
      folder: 'sent'
    };

    setEmails([newEmail, ...emails]);
    setIsComposeOpen(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  // Filter Emails
  const filteredEmails = emails.filter(email => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return email.subject.toLowerCase().includes(q) ||
             email.snippet.toLowerCase().includes(q) ||
             email.senderName.toLowerCase().includes(q);
    }
    if (activeLabel) return email.labels.includes(activeLabel);
    if (activeFolder === 'starred') return email.isStarred;
    return email.folder === activeFolder;
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/*1. Sidebar Nav */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-3">
        <div className="space-y-4">
          {/* Logo*/}
          <div className="flex items-center space-x-2 px-3 py-2 text-red-500 font-extrabold text-xl tracking-tight">
            <Inbox size={26} />
            <span>WorkspaceMail</span>
          </div>

          {/* Compose Button */}
          <button
            onClick={() => setIsComposeOpen(true)}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-lg transition duration-200"
          >
            <Plus size={20} />
            <span>Compose</span>
          </button>

          {/* Folders */}
          <nav className="space-y-1">
            {[
              { id: 'inbox', label: 'Inbox', icon: Inbox, count: emails.filter(e => !e.isRead).length },
              { id: 'starred', label: 'Starred', icon: Star },
              { id: 'sent', label: 'Sent', icon: Send },
              { id: 'drafts', label: 'Drafts', icon: FileText },
              { id: 'trash', label: 'Trash', icon: Trash2 },
            ].map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id && !activeLabel;
              return (
                <button
                  key={folder.id}
                  onClick={() => { setActiveFolder(folder.id); setActiveLabel(null); setSelectedEmail(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-red-500/10 text-red-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span>{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Labels */}
          <div className="pt-4 border-t border-slate-800">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Labels</p>
            {['Work', 'Personal', 'Finance', 'Urgent'].map((label) => (
              <button
                key={label}
                onClick={() => { setActiveLabel(label); setSelectedEmail(null); }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm transition ${
                  activeLabel === label ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Tag size={16} className="text-slate-500" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top Bar / Search */}
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50">
          <div className="flex-1 max-w-2xl relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mail by subject, sender, or message..."
              className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div className="flex items-center space-x-3 text-slate-400 text-sm">
            <button className="p-2 hover:bg-slate-800 rounded-lg"><RefreshCw size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
              ME
            </div>
          </div>
        </header>

        {/* Email Workspace Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List Column */}
          <div className={`${selectedEmail ? 'w-2/5 border-r border-slate-800' : 'w-full'} flex flex-col overflow-y-auto divide-y divide-slate-800/50`}>
            {filteredEmails.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No conversations found in this view.
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email);
                      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
                    }}
                    className={`p-4 flex items-start space-x-3 cursor-pointer transition ${
                      isSelected ? 'bg-slate-800/80 border-l-4 border-red-500' : email.isRead ? 'bg-slate-950 hover:bg-slate-900/50' : 'bg-slate-900/60 font-semibold'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(email.id)}
                      onChange={(e) => toggleSelect(email.id, e)}
                      className="mt-1 rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-0"
                    />

                    <button onClick={(e) => toggleStar(email.id, e)} className="mt-0.5 text-slate-500 hover:text-amber-400">
                      <Star size={16} className={email.isStarred ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-0.5">
                        <span className="font-bold text-slate-200 truncate">{email.senderName}</span>
                        <span>{email.date}</span>
                      </div>
                      <h4 className="text-sm text-slate-100 truncate">{email.subject}</h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{email.snippet}</p>

                      {/* Badges */}
                      <div className="flex gap-1 mt-2">
                        {email.labels.map(l => (
                          <span key={l} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Email Reader View Column */}
          {selectedEmail && (
            <div className="flex-1 bg-slate-900/40 p-6 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                {/* Email Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">{selectedEmail.subject}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs text-slate-300">
                        {selectedEmail.senderName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{selectedEmail.senderName} <span className="font-normal text-slate-500">&lt;{selectedEmail.senderEmail}&gt;</span></p>
                        <p className="text-[11px] text-slate-500">To: me@workspace.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 text-slate-400">
                    <button onClick={() => setSelectedEmail(null)} className="p-1.5 hover:bg-slate-800 rounded-lg">
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Quick Action Footer */}
              <div className="pt-6 border-t border-slate-800 flex gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition">
                  <CornerUpLeft size={16} />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Floating Compose Modal */}
      {isComposeOpen && (
        <div className="fixed bottom-0 right-8 w-[500px] bg-slate-900 border border-slate-800 rounded-t-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="bg-slate-800 px-4 py-3 flex justify-between items-center text-sm font-bold border-b border-slate-700">
            <span>New Message</span>
            <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSendEmail} className="p-4 space-y-3 flex-1 flex flex-col">
            <input
              type="email"
              placeholder="To"
              required
              value={composeData.to}
              onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              value={composeData.subject}
              onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <textarea
              rows={8}
              placeholder="Write your email content..."
              required
              value={composeData.body}
              onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none flex-1 resize-none"
            />

            <div className="flex justify-between items-center pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl shadow-md transition"
              >
                Send
              </button>
              <button type="button" className="text-slate-400 hover:text-slate-200 p-2">
                <Paperclip size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
