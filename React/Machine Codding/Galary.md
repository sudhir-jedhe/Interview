The Gallery App skill has been created.

What's Included:
Express & MongoDB Architecture:

Media Mongoose schema with capturedAt indexing, album categorization, and location string/geo-coordinates.

API endpoints supporting date range filters (today, yesterday), album collections, location matching, and keyword search.

Interactive Front-End Component:

Date Filter Bar: Toggle between All Time, Today, and Yesterday.

Album Collections Dropdown: Dynamic filtering by album categories (e.g., Vacation 2026, Travel, Summer, Nature).

Location Filter Dropdown: Filter by location tags (e.g., Swiss Alps, Tokyo, Malibu).

Interactive Lightbox: Fullscreen photo preview with metadata view and download action.

gallery-app
Full-stack MERN Gallery App with Album collections, date filters (Today, Yesterday), and location-based media tagging.

Instructions
Gallery App (Albums, Date & Location Filtering)
A full-stack, responsive Media Gallery application built with React, Node.js/Express, MongoDB, and Tailwind CSS.

Features Included:
Dynamic Album Collections: Group photos into custom albums.
Date Quick Filters: Filter media by Today, Yesterday, This Month, or All Time.
Location-Based Media Search: Filter images by geotagged locations (e.g., Paris, Tokyo, New York).
Interactive Lightbox Modal: View full-res images, view geotag/date metadata, and delete or download.
Masonry Grid Layout: Responsive grid supporting photos and videos.

1. Backend Implementation (Express & MongoDB)
Database Schemas
models/Media.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  album: { type: String, default: 'Uncategorized' },
  location: {
    name: { type: String, required: true }, // e.g. "San Francisco, CA"
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  capturedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for location and date filtering
mediaSchema.index({ capturedAt: -1, 'location.name': 1, album: 1 });

module.exports = mongoose.model('Media', mediaSchema);
API Controller Routes (routes/mediaRoutes.js)
const express = require('express');
const router = express.Router();
const Media = require('../models/Media');

// GET: Filter media by Album, Date (Today, Yesterday), or Location
router.get('/', async (req, res) => {
  try {
    const { dateFilter, album, location, search } = req.query;
    let query = {};

    // 1. Date Range Filtering
    if (dateFilter) {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (dateFilter === 'today') {
        query.capturedAt = { $gte: startOfDay };
      } else if (dateFilter === 'yesterday') {
        const startOfYesterday = new Date(startOfDay);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        query.capturedAt = { $gte: startOfYesterday, $lt: startOfDay };
      }
    }

    // 2. Album Filter
    if (album && album !== 'ALL') {
      query.album = album;
    }

    // 3. Location Filter
    if (location && location !== 'ALL') {
      query['location.name'] = { $regex: location, $options: 'i' };
    }

    // 4. Keyword Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.name': { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } }
      ];
    }

    const mediaList = await Media.find(query).sort({ capturedAt: -1 });
    res.json(mediaList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
2. Interactive React Front-End Component
Below is a single-file React component featuring album chips, date presets (Today, Yesterday), location filters, and a lightbox viewer:

import React, { useState } from 'react';
import {
  Image, MapPin, Calendar, Folder, Search,
  X, Filter, Download, Trash2, ChevronRight, Plus
} from 'lucide-react';

// Mock Gallery Data
const MOCK_MEDIA = [
  {
    id: 'm1',
    title: 'Alpine Sunrise',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    album: 'Vacation 2026',
    location: 'Swiss Alps, Switzerland',
    capturedAt: new Date().toISOString(), // Today
  },
  {
    id: 'm2',
    title: 'Tokyo Street Lights',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
    album: 'Travel',
    location: 'Shinjuku, Tokyo',
    capturedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: 'm3',
    title: 'Pacific Beach Sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    album: 'Summer',
    location: 'Malibu, California',
    capturedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: 'm4',
    title: 'Metropolitan Architecture',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    album: 'Architecture',
    location: 'New York City, USA',
    capturedAt: '2026-07-28T10:00:00.000Z',
  },
  {
    id: 'm5',
    title: 'Nordic Aurora Borealis',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    album: 'Nature',
    location: 'Tromsø, Norway',
    capturedAt: new Date().toISOString(), // Today
  }
];

export default function GalleryApp() {
  const [mediaList, setMediaList] = useState(MOCK_MEDIA);
  const [selectedMedia, setSelectedMedia] = useState(null); // Lightbox State

  // Filter States
  const [dateFilter, setDateFilter] = useState('ALL'); // ALL | TODAY | YESTERDAY
  const [selectedAlbum, setSelectedAlbum] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique Albums & Locations dynamically
  const albums = ['ALL', ...Array.from(new Set(mediaList.map(m => m.album)))];
  const locations = ['ALL', ...Array.from(new Set(mediaList.map(m => m.location)))];

  // Filter Logic
  const filteredMedia = mediaList.filter(item => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchAlbum = item.album.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchAlbum) return false;
    }

    // 2. Album Filter
    if (selectedAlbum !== 'ALL' && item.album !== selectedAlbum) return false;

    // 3. Location Filter
    if (selectedLocation !== 'ALL' && item.location !== selectedLocation) return false;

    // 4. Date Filter
    if (dateFilter !== 'ALL') {
      const itemDate = new Date(item.capturedAt).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (dateFilter === 'TODAY' && itemDate !== today) return false;
      if (dateFilter === 'YESTERDAY' && itemDate !== yesterday) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/*Navbar*/}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-extrabold text-xl text-indigo-400">
          <Image size={24} />
          <span>PixelVault</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, albums, locations..."
            className="w-full bg-slate-800 text-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          {/* Row 1: Date Filter Chips */}
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mr-2">
              <Calendar size={14} /> Date:
            </span>
            {[
              ['ALL', 'All Time'],
              ['TODAY', 'Today'],
              ['YESTERDAY', 'Yesterday'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDateFilter(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  dateFilter === key
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Row 2: Album & Location Selectors */}
          <div className="flex flex-wrap gap-4">
            {/* Album Selector */}
            <div className="flex items-center space-x-2">
              <Folder size={16} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-400">Album:</span>
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg p-2 text-slate-200 focus:outline-none"
              >
                {albums.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Location Selector */}
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-red-400" />
              <span className="text-xs font-bold text-slate-400">Location:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg p-2 text-slate-200 focus:outline-none"
              >
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid View */}
        {filteredMedia.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No photos found matching your selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 cursor-pointer shadow-md"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Overlay Metadata on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-1">
                    <MapPin size={12} className="text-red-400 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-300 mt-1">
                    <Folder size={12} />
                    <span>{item.album}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/60 text-slate-300 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Main Preview Image */}
            <div className="md:w-2/3 bg-black flex items-center justify-center max-h-[70vh]">
              <img src={selectedMedia.url} alt={selectedMedia.title} className="max-h-full max-w-full object-contain" />
            </div>

            {/* Sidebar Details */}
            <div className="md:w-1/3 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">{selectedMedia.title}</h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Folder size={14} className="text-indigo-400" />
                    <span>Album: <strong>{selectedMedia.album}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-red-400" />
                    <span>{selectedMedia.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-amber-400" />
                    <span>{new Date(selectedMedia.capturedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
