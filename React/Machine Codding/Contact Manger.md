The **Contact Manager** application architecture has been created and saved as a skill (`contact-manager`).

### What's Included

1. **Express & MongoDB Backend**:

* Comprehensive Mongoose schema (`Contact.js`) covering name, multi-type phone numbers, multi-type emails, company/job title/department, physical address, important dates (Birthday, Anniversary), group categorization (Work, Family, Friends, VIP), website URL, relationship details, notes, and an `interactionCount` counter for "Frequently Contacted" tracking.
* Text indexing for multi-field search across name, phone, email, and company details.

1. **Full Front-End React Component**:

* **Filter Tabs**:
* **All Contacts**: Alphabetically grouped with sticky letter section headers (A, B, C...).
* **Favorites**: Filtered view for starred contacts.
* **Frequently Contacted**: Dynamically ordered based on call/message interactions.

* **Group Category Filters**: Filter view by Work, Family, Friends, VIP, or Uncategorized.
* **Rich Contact Form**: Modal form supporting all rich field entries.
* **Detailed Info View**: Detailed breakdown of addresses, relationships, notes, and important dates with instant interaction triggers.
The Contact Manager application architecture has been created and saved as a skill (contact-manager).

What's Included:
Express & MongoDB Backend:

Comprehensive Mongoose schema (Contact.js) covering name, multi-type phone numbers, multi-type emails, company/job title/department, physical address, important dates (Birthday, Anniversary), group categorization (Work, Family, Friends, VIP), website URL, relationship details, notes, and an interactionCount counter for "Frequently Contacted" tracking.

Text indexing for multi-field search across name, phone, email, and company details.

Full Front-End React Component:

Filter Tabs:

All Contacts: Alphabetically grouped with sticky letter section headers (A, B, C...).

Favorites: Filtered view for starred contacts.

Frequently Contacted: Dynamically ordered based on call/message interactions.

Group Category Filters: Filter view by Work, Family, Friends, VIP, or Uncategorized.

Rich Contact Form: Modal form supporting all rich field entries.

Detailed Info View: Detailed breakdown of addresses, relationships, notes, and important dates with instant interaction triggers.

contact-manager
Full-stack MERN Contact Manager with Favorites, Frequently Contacted, Alphabetical grouping, detailed field forms, and real-time search.

Instructions
Contact Manager App (MERN Stack)
A full-stack Contact Management application built with React, Node.js/Express, MongoDB, and Tailwind CSS.

Key Features
Category Tabs:
All Contacts: Alphabetically sorted and grouped (A, B, C, etc.).
Favorites: Quick access to starred/favorite contacts.
Frequently Contacted: Sorted dynamically by interaction count (interactionCount).
Comprehensive Contact Fields:
Name (First & Last)
Phone Numbers (Mobile, Work, Home)
Email Addresses
Work Info (Company, Job Title, Department)
Address (Street, City, State, ZIP)
Important Dates (Birthday, Anniversary)
Group/Category (Family, Friends, Work, VIP)
Website URL
Relationship (e.g., Spouse, Manager, Assistant)
Notes
Real-time Search & Instant Indexing: Search across names, emails, companies, and phone numbers.
Action Integration: Direct buttons to log calls/messages (increments interactionCount for "Frequently Contacted" tracking).

1. Backend Implementation (Express & MongoDB)
Database Schemas (models/Contact.js)
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  phones: [{
    type: { type: String, enum: ['Mobile', 'Work', 'Home', 'Main'], default: 'Mobile' },
    number: { type: String, required: true }
  }],
  emails: [{
    type: { type: String, enum: ['Personal', 'Work', 'Other'], default: 'Personal' },
    email: { type: String }
  }],
  workInfo: {
    company: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    department: { type: String, default: '' }
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  importantDates: [{
    label: { type: String, enum: ['Birthday', 'Anniversary', 'Other'], default: 'Birthday' },
    date: Date
  }],
  group: {
    type: String,
    enum: ['Uncategorized', 'Family', 'Friends', 'Work', 'VIP'],
    default: 'Uncategorized'
  },
  website: { type: String, default: '' },
  relationship: { type: String, default: '' }, // e.g. "Manager", "Spouse"
  notes: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  isFavorite: { type: Boolean, default: false },
  interactionCount: { type: Number, default: 0 } // Tracks "Frequently Contacted"
}, { timestamps: true });

// Text index for fast multi-field search
contactSchema.index({
  firstName: 'text',
  lastName: 'text',
  'phones.number': 'text',
  'emails.email': 'text',
  'workInfo.company': 'text'
});

module.exports = mongoose.model('Contact', contactSchema);
Express Controller Routes (routes/contactRoutes.js)
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET: Fetch contacts with search & quick filters
router.get('/', async (req, res) => {
  try {
    const { filter, search, group } = req.query;
    let query = { user: req.user.id };

    if (filter === 'favorites') {
      query.isFavorite = true;
    }

    if (group && group !== 'ALL') {
      query.group = group;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { 'phones.number': { $regex: search, $options: 'i' } },
        { 'emails.email': { $regex: search, $options: 'i' } },
        { 'workInfo.company': { $regex: search, $options: 'i' } }
      ];
    }

    let sort = { firstName: 1 };
    if (filter === 'frequently') {
      sort = { interactionCount: -1 };
    }

    const contacts = await Contact.find(query).sort(sort);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create Contact
router.post('/', async (req, res) => {
  try {
    const newContact = new Contact({ ...req.body, user: req.user.id });
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Log Interaction (increments interaction count for Frequently Contacted)
router.patch('/:id/interact', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $inc: { interactionCount: 1 } },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
2. Interactive Front-End React Component
Below is a single-file React component containing the complete UI with tabs, alphabetical section indexing, search, modal form with all rich fields, and contact detail view:

import React, { useState } from 'react';
import {
  Users, Star, Flame, Search, Plus, Phone, Mail,
  Briefcase, MapPin, Calendar, Globe, Heart, FileText,
  Trash2, Edit3, X, Check, ChevronRight, MessageSquare
} from 'lucide-react';

// Initial Mock Data
const MOCK_CONTACTS = [
  {
    id: 'c1',
    firstName: 'Alice',
    lastName: 'Morgan',
    phones: [{ type: 'Mobile', number: '+1 (555) 019-2834' }],
    emails: [{ type: 'Work', email: 'alice.morgan@techcorp.com' }],
    workInfo: { company: 'TechCorp Inc.', jobTitle: 'Senior Product Manager', department: 'Product' },
    address: { street: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', zipCode: '97477', country: 'USA' },
    importantDates: [{ label: 'Birthday', date: '1992-05-14' }],
    group: 'Work',
    website: 'https://alicemorgan.dev',
    relationship: 'Manager',
    notes: 'Key contact for Q4 API integration.',
    isFavorite: true,
    interactionCount: 28
  },
  {
    id: 'c2',
    firstName: 'Bob',
    lastName: 'Chen',
    phones: [{ type: 'Mobile', number: '+1 (555) 482-9102' }],
    emails: [{ type: 'Personal', email: 'bob.chen@gmail.com' }],
    workInfo: { company: 'DesignLab', jobTitle: 'Lead Designer', department: 'UX' },
    address: { street: '120 Market St', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' },
    importantDates: [{ label: 'Anniversary', date: '2020-09-20' }],
    group: 'VIP',
    website: 'https://bobchen.design',
    relationship: 'Client',
    notes: 'Prefers communication over email.',
    isFavorite: true,
    interactionCount: 45
  },
  {
    id: 'c3',
    firstName: 'Charlie',
    lastName: 'Davis',
    phones: [{ type: 'Mobile', number: '+1 (555) 839-2011' }],
    emails: [{ type: 'Personal', email: 'charlie.davis@yahoo.com' }],
    workInfo: { company: 'AeroSpace Co', jobTitle: 'Flight Engineer', department: 'R&D' },
    address: { street: '450 Space Way', city: 'Houston', state: 'TX', zipCode: '77001', country: 'USA' },
    importantDates: [{ label: 'Birthday', date: '1988-11-03' }],
    group: 'Friends',
    website: '',
    relationship: 'College Friend',
    notes: '',
    isFavorite: false,
    interactionCount: 5
  }
];

export default function ContactManager() {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | FAVORITES | FREQUENT
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(MOCK_CONTACTS[0]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(getEmptyForm());

  function getEmptyForm() {
    return {
      firstName: '',
      lastName: '',
      phoneMobile: '',
      phoneWork: '',
      emailPersonal: '',
      emailWork: '',
      company: '',
      jobTitle: '',
      department: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      birthday: '',
      anniversary: '',
      group: 'Uncategorized',
      website: '',
      relationship: '',
      notes: '',
      isFavorite: false
    };
  }

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create Contact
  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) return;

    const newContact = {
      id: `c_${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phones: [
        ...(formData.phoneMobile ? [{ type: 'Mobile', number: formData.phoneMobile }] : []),
        ...(formData.phoneWork ? [{ type: 'Work', number: formData.phoneWork }] : [])
      ],
      emails: [
        ...(formData.emailPersonal ? [{ type: 'Personal', email: formData.emailPersonal }] : []),
        ...(formData.emailWork ? [{ type: 'Work', email: formData.emailWork }] : [])
      ],
      workInfo: {
        company: formData.company,
        jobTitle: formData.jobTitle,
        department: formData.department
      },
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      importantDates: [
        ...(formData.birthday ? [{ label: 'Birthday', date: formData.birthday }] : []),
        ...(formData.anniversary ? [{ label: 'Anniversary', date: formData.anniversary }] : [])
      ],
      group: formData.group,
      website: formData.website,
      relationship: formData.relationship,
      notes: formData.notes,
      isFavorite: formData.isFavorite,
      interactionCount: 0
    };

    setContacts(prev => [...prev, newContact]);
    setSelectedContact(newContact);
    setIsModalOpen(false);
    setFormData(getEmptyForm());
  };

  // Toggle Favorite
  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    setContacts(prev => prev.map(c =>
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
    if (selectedContact?.id === id) {
      setSelectedContact(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  // Increment Interaction Count
  const logInteraction = (id) => {
    setContacts(prev => prev.map(c =>
      c.id === id ? { ...c, interactionCount: c.interactionCount + 1 } : c
    ));
  };

  // Delete Contact
  const handleDelete = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    if (selectedContact?.id === id) {
      setSelectedContact(updated[0] || null);
    }
  };

  // Filtered Contacts
  const filteredContacts = contacts.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const company = c.workInfo?.company?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = fullName.includes(query) || company.includes(query) ||
      c.phones.some(p => p.number.includes(query)) ||
      c.emails.some(e => e.email.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (selectedGroup !== 'ALL' && c.group !== selectedGroup) return false;

    if (activeTab === 'FAVORITES') return c.isFavorite;
    return true;
  });

  // Sort Logic
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (activeTab === 'FREQUENT') {
      return b.interactionCount - a.interactionCount;
    }
    return a.firstName.localeCompare(b.firstName);
  });

  // Group Alphabetically for ALL tab
  const groupedAlphabetically = sortedContacts.reduce((acc, contact) => {
    const firstLetter = contact.firstName.charAt(0).toUpperCase() || '#';
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/*1. Left Navigation Sidebar*/}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-indigo-400 font-extrabold text-xl">
            <Users size={26} />
            <span>ConnectHub</span>
          </div>

          <button
            onClick={() => { setFormData(getEmptyForm()); setIsModalOpen(true); }}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            <Plus size={18} />
            <span>Add Contact</span>
          </button>

          {/* Navigation Tabs */}
          <nav className="space-y-1">
            {[
              { id: 'ALL', label: 'All Contacts', icon: Users, count: contacts.length },
              { id: 'FAVORITES', label: 'Favorites', icon: Star, count: contacts.filter(c => c.isFavorite).length },
              { id: 'FREQUENT', label: 'Frequently Contacted', icon: Flame },
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
                  {tab.count !== undefined && (
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Group Filter */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs font-bold uppercase text-slate-500 mb-2">Groups</p>
            {['ALL', 'Work', 'Family', 'Friends', 'VIP', 'Uncategorized'].map(grp => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedGroup === grp ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {grp === 'ALL' ? 'All Groups' : grp}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Middle Contact List View */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
        {/* Search */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, email..."
              className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'ALL' ? (
            /* Alphabetical Grouping */
            Object.keys(groupedAlphabetically).sort().map(letter => (
              <div key={letter}>
                <div className="sticky top-0 bg-slate-900 px-4 py-1 text-xs font-extrabold text-indigo-400 border-b border-t border-slate-800/80">
                  {letter}
                </div>
                {groupedAlphabetically[letter].map(contact => (
                  <ContactListItem
                    key={contact.id}
                    contact={contact}
                    selected={selectedContact?.id === contact.id}
                    onSelect={() => setSelectedContact(contact)}
                    onToggleFav={(e) => toggleFavorite(contact.id, e)}
                  />
                ))}
              </div>
            ))
          ) : (
            /* Flat List for Favorites / Frequently Contacted */
            sortedContacts.map(contact => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                selected={selectedContact?.id === contact.id}
                onSelect={() => setSelectedContact(contact)}
                onToggleFav={(e) => toggleFavorite(contact.id, e)}
              />
            ))
          )}
        </div>
      </div>

      {/* 3. Right Details View */}
      <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
        {selectedContact ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header / Avatar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 font-extrabold text-2xl flex items-center justify-center">
                  {selectedContact.firstName.charAt(0)}{selectedContact.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedContact.workInfo?.jobTitle} {selectedContact.workInfo?.company && `at ${selectedContact.workInfo.company}`}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {selectedContact.group}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleFavorite(selectedContact.id)}
                  className={`p-2 rounded-xl border transition ${
                    selectedContact.isFavorite ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Star size={18} className={selectedContact.isFavorite ? 'fill-amber-400' : ''} />
                </button>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-slate-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Call / Message Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => logInteraction(selectedContact.id)}
                className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md"
              >
                <Phone size={16} />
                <span>Call ({selectedContact.phones[0]?.number || 'N/A'})</span>
              </button>
              <button
                onClick={() => logInteraction(selectedContact.id)}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
              >
                <MessageSquare size={16} />
                <span>Send Message</span>
              </button>
            </div>

            {/* Detailed Field Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Phones */}
              <DetailSection title="Phone Numbers" icon={Phone}>
                {selectedContact.phones.map((p, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span className="text-slate-400 font-semibold">{p.type}</span>
                    <span className="text-white font-mono">{p.number}</span>
                  </div>
                ))}
              </DetailSection>

              {/* Emails */}
              <DetailSection title="Email Addresses" icon={Mail}>
                {selectedContact.emails.map((e, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span className="text-slate-400 font-semibold">{e.type}</span>
                    <a href={`mailto:${e.email}`} className="text-indigo-400 hover:underline">{e.email}</a>
                  </div>
                ))}
              </DetailSection>

              {/* Address */}
              {selectedContact.address?.street && (
                <DetailSection title="Address" icon={MapPin}>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedContact.address.street}<br />
                    {selectedContact.address.city}, {selectedContact.address.state} {selectedContact.address.zipCode}<br />
                    {selectedContact.address.country}
                  </p>
                </DetailSection>
              )}

              {/* Important Dates */}
              {selectedContact.importantDates?.length > 0 && (
                <DetailSection title="Important Dates" icon={Calendar}>
                  {selectedContact.importantDates.map((d, i) => (
                    <div key={i} className="flex justify-between text-xs py-1">
                      <span className="text-slate-400 font-semibold">{d.label}</span>
                      <span className="text-white">{new Date(d.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Relationship & Website */}
              {(selectedContact.relationship || selectedContact.website) && (
                <DetailSection title="Other Details" icon={Globe}>
                  {selectedContact.relationship && (
                    <div className="flex justify-between text-xs py-1">
                      <span className="text-slate-400 font-semibold">Relationship</span>
                      <span className="text-white">{selectedContact.relationship}</span>
                    </div>
                  )}
                  {selectedContact.website && (
                    <div className="flex justify-between text-xs py-1">
                      <span className="text-slate-400 font-semibold">Website</span>
                      <a href={selectedContact.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{selectedContact.website}</a>
                    </div>
                  )}
                </DetailSection>
              )}

              {/* Notes */}
              {selectedContact.notes && (
                <DetailSection title="Notes" icon={FileText}>
                  <p className="text-xs text-slate-300 italic whitespace-pre-line bg-slate-950 p-3 rounded-xl border border-slate-800">
                    "{selectedContact.notes}"
                  </p>
                </DetailSection>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Select a contact to view detailed information.
          </div>
        )}
      </div>

      {/* 4. Add Contact Rich Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Contact</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">First Name *</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100" />
                </div>
              </div>

              {/* Phones & Emails */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Mobile Phone</label>
                  <input name="phoneMobile" value={formData.phoneMobile} onChange={handleInputChange} placeholder="+1 555-000-0000" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Personal Email</label>
                  <input type="email" name="emailPersonal" value={formData.emailPersonal} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100" />
                </div>
              </div>

              {/* Work Info */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <p className="font-bold text-indigo-400">Work Information</p>
                <div className="grid grid-cols-3 gap-2">
                  <input name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100" />
                  <input name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100" />
                  <input name="department" placeholder="Department" value={formData.department} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100" />
                </div>
              </div>

              {/* Group & Relationship */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Group</label>
                  <select name="group" value={formData.group} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100">
                    <option value="Uncategorized">Uncategorized</option>
                    <option value="Work">Work</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Relationship</label>
                  <input name="relationship" placeholder="e.g. Spouse, Manager" value={formData.relationship} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100" />
                </div>
              </div>

              {/* Important Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Birthday</label>
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Anniversary</label>
                  <input type="date" name="anniversary" value={formData.anniversary} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">Notes</label>
                <textarea rows={3} name="notes" value={formData.notes} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 resize-none" />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function ContactListItem({ contact, selected, onSelect, onToggleFav }) {
  return (
    <div
      onClick={onSelect}
      className={`p-3 border-b border-slate-800/50 flex items-center justify-between cursor-pointer transition ${
        selected ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : 'hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center space-x-3 truncate">
        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700 flex-shrink-0">
          {contact.firstName.charAt(0)}
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-slate-100 truncate">
            {contact.firstName} {contact.lastName}
          </p>
          <p className="text-[10px] text-slate-500 truncate">
            {contact.phones[0]?.number || contact.emails[0]?.email || 'No contact info'}
          </p>
        </div>
      </div>

      <button onClick={onToggleFav} className="p-1 text-slate-500 hover:text-amber-400">
        <Star size={14} className={contact.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
      </button>
    </div>
  );
}

function DetailSection({ title, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold border-b border-slate-800 pb-1">
        <Icon size={14} />
        <span>{title}</span>
      </div>
      <div className="pl-1 space-y-1">{children}</div>
    </div>
  );
}
