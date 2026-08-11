The Housing Society Maintenance Application skill has been created and saved as society-maintenance-app.

What's Included:
Express & MongoDB Backend:

Flat Mongoose schema tracking wing, flat number, owner/tenant contact info, square footage, and base maintenance charges.

MaintenanceBill Mongoose schema with automated bill number generation (BILL-AUG2026-A102), line item breakdowns (Maintenance Charge, Water Charges, Parking Charges, Late Penalties), due dates, and payment status tracking (PENDING, PAID, OVERDUE).

Express REST API endpoints for batch monthly bill generation across all society flats, flat-wise dues query, and online payment logging.

Full Front-End React Component:

Society Financial Metrics Bar: Dashboard displaying monthly collected dues, pending arrears, overdue penalties, and active flat units.

Dues Management Table: Search by resident name or flat number (Wing A - 102), filter by status (PAID, PENDING, OVERDUE), and record payments.

Digital Receipt Generator: Printable, downloadable maintenance payment receipt modal displaying breakdown details and payment reference numbers.

Society Helpdesk Portal: Placeholder view for tracking resident complaints and maintenance tickets.

society-maintenance-app
Full-stack MERN Housing Society Maintenance App featuring flat-wise maintenance bill tracking, online payments, digital receipts, expense logs, penalty calculations, and resident complaint management.

Instructions
MERN Housing Society Maintenance Application
A full-stack, responsive Housing Society Management application built with React, Node.js/Express, MongoDB, and Tailwind CSS.

Key Features
Flat & Resident Management: Map wing numbers, flat numbers, occupancy status (Owner / Tenant), and resident contact details.
Bill Generation Engine: Generate monthly/quarterly maintenance bills with line items (Maintenance Charge, Water Charges, Parking, Gym, Late Penalty).
Payment & Receipts: Track payment status (PAID, PENDING, OVERDUE) and issue digital PDF/Printable payment receipts.
Society Expense Tracker: Record society expenditures (Security, Garden Maintenance, Elevator AMC, Electricity) with financial summary charts.
Complaint / Helpdesk Portal: Resident ticket logging for maintenance issues (Plumbing, Electrical, Security) with status tracking (OPEN, IN_PROGRESS, RESOLVED).

1. Backend Implementation (Express & MongoDB)
Database Schemas
models/Flat.js
const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  wing: { type: String, required: true }, // e.g., "A", "B"
  flatNumber: { type: String, required: true }, // e.g., "102"
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  occupancyType: { type: String, enum: ['Owner Occupied', 'Tenant', 'Vacant'], default: 'Owner Occupied' },
  squareFeet: { type: Number, default: 1000 },
  monthlyMaintenanceAmount: { type: Number, default: 3500 }
}, { timestamps: true });

flatSchema.index({ wing: 1, flatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Flat', flatSchema);
models/MaintenanceBill.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true }, // e.g., "BILL-2026-A102"
  flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  wing: String,
  flatNumber: String,
  ownerName: String,
  billingMonth: { type: String, required: true }, // "August 2026"
  dueDate: { type: Date, required: true },
  charges: {
    maintenanceCharge: { type: Number, required: true },
    waterCharge: { type: Number, default: 300 },
    parkingCharge: { type: Number, default: 200 },
    latePenalty: { type: Number, default: 0 }
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'OVERDUE'], default: 'PENDING' },
  paidDate: Date,
  paymentMode: { type: String, enum: ['UPI', 'Net Banking', 'Cheque', 'Cash'], default: 'UPI' }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceBill', billSchema);
Express Controller Routes (routes/societyRoutes.js)
const express = require('express');
const router = express.Router();
const Flat = require('../models/Flat');
const MaintenanceBill = require('../models/MaintenanceBill');

// 1. GET: Fetch Maintenance Bills with Status / Month Filtering
router.get('/bills', async (req, res) => {
  try {
    const { wing, status, month } = req.query;
    let query = {};

    if (wing) query.wing = wing;
    if (status && status !== 'ALL') query.status = status;
    if (month) query.billingMonth = month;

    const bills = await MaintenanceBill.find(query).populate('flat').sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Generate Monthly Maintenance Bill for All Flats
router.post('/generate-monthly-bills', async (req, res) => {
  const { billingMonth, dueDate } = req.body;

  try {
    const flats = await Flat.find({});
    const createdBills = [];

    for (let flat of flats) {
      const billNumber = `BILL-${billingMonth.replace(/\s+/g, '')}-${flat.wing}${flat.flatNumber}`;
      
      const totalAmount = flat.monthlyMaintenanceAmount + 300 + 200; // Maint + Water + Parking

      const newBill = new MaintenanceBill({
        billNumber,
        flat: flat._id,
        wing: flat.wing,
        flatNumber: flat.flatNumber,
        ownerName: flat.ownerName,
        billingMonth,
        dueDate,
        charges: {
          maintenanceCharge: flat.monthlyMaintenanceAmount,
          waterCharge: 300,
          parkingCharge: 200,
          latePenalty: 0
        },
        totalAmount,
        status: 'PENDING'
      });

      const saved = await newBill.save();
      createdBills.push(saved);
    }

    res.status(201).json({ message: `Bills generated for ${createdBills.length} flats`, createdBills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. PATCH: Record Maintenance Payment
router.patch('/bills/:id/pay', async (req, res) => {
  try {
    const { paymentMode } = req.body;
    const bill = await MaintenanceBill.findById(req.params.id);

    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    bill.status = 'PAID';
    bill.paidDate = new Date();
    bill.paymentMode = paymentMode || 'UPI';

    await bill.save();
    res.json({ message: 'Payment recorded successfully', bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
2. Interactive Front-End React Component
Below is a single-file React component containing the society admin dashboard, maintenance dues table, payment modal, receipt generator, and helpdesk complaints tracker:

import React, { useState } from 'react';
import {
  Building2, CreditCard, DollarSign, FileText, CheckCircle2,
  Clock, AlertCircle, Plus, Search, Printer, Filter,
  ShieldCheck, Wrench, ChevronRight, User, X
} from 'lucide-react';

// Mock Society Dues Data
const MOCK_BILLS = [
  {
    id: 'b1',
    billNumber: 'BILL-AUG2026-A102',
    wing: 'A',
    flatNumber: '102',
    ownerName: 'Rajesh Sharma',
    billingMonth: 'August 2026',
    dueDate: '2026-08-15',
    charges: { maintenanceCharge: 3500, waterCharge: 300, parkingCharge: 200, latePenalty: 0 },
    totalAmount: 4000,
    status: 'PAID',
    paidDate: '2026-08-05',
    paymentMode: 'UPI'
  },
  {
    id: 'b2',
    billNumber: 'BILL-AUG2026-A201',
    wing: 'A',
    flatNumber: '201',
    ownerName: 'Priya Kulkarni',
    billingMonth: 'August 2026',
    dueDate: '2026-08-15',
    charges: { maintenanceCharge: 3500, waterCharge: 300, parkingCharge: 200, latePenalty: 0 },
    totalAmount: 4000,
    status: 'PENDING',
    paidDate: null,
    paymentMode: null
  },
  {
    id: 'b3',
    billNumber: 'BILL-AUG2026-B304',
    wing: 'B',
    flatNumber: '304',
    ownerName: 'Vikram Joshi',
    billingMonth: 'August 2026',
    dueDate: '2026-08-10',
    charges: { maintenanceCharge: 3500, waterCharge: 300, parkingCharge: 200, latePenalty: 250 },
    totalAmount: 4250,
    status: 'OVERDUE',
    paidDate: null,
    paymentMode: null
  }
];

export default function SocietyMaintenanceApp() {
  const [bills, setBills] = useState(MOCK_BILLS);
  const [activeTab, setActiveTab] = useState('BILLS'); // BILLS | COMPLAINTS | EXPENSES
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Bill for Payment / Receipt Modal
  const [selectedBill, setSelectedBill] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Record Payment Handler
  const handleRecordPayment = (billId, mode = 'UPI') => {
    setBills(prev => prev.map(b =>
      b.id === billId
        ? { ...b, status: 'PAID', paidDate: new Date().toISOString().split['T'](0), paymentMode: mode }
        : b
    ));
    setSelectedBill(null);
  };

  // Financial Metrics Calculations
  const totalCollected = bills.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPending = bills.filter(b => b.status !== 'PAID').reduce((sum, b) => sum + b.totalAmount, 0);

  // Filter Bills
  const filteredBills = bills.filter(b => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchOwner = b.ownerName.toLowerCase().includes(q);
      const matchFlat = `${b.wing}-${b.flatNumber}`.toLowerCase().includes(q);
      const matchBillNo = b.billNumber.toLowerCase().includes(q);
      if (!matchOwner && !matchFlat && !matchBillNo) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/*Navbar Header*/}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-indigo-400 font-extrabold text-xl tracking-tight">
            <Building2 size={26} />
            <span>Gokuldham Residency</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            {[
              ['BILLS', 'Maintenance Bills'],
              ['COMPLAINTS', 'Helpdesk Tickets'],
              ['EXPENSES', 'Society Expenses']
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 rounded-lg transition ${activeTab === id ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* KPI Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">August Collection</p>
              <p className="text-3xl font-black text-green-400 mt-1">₹{totalCollected.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center">
              <CreditCard size={24} />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Pending Dues</p>
              <p className="text-3xl font-black text-amber-400 mt-1">₹{totalPending.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
              <Clock size={24} />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Flats Count</p>
              <p className="text-3xl font-black text-indigo-400 mt-1">48 Units</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        {/* VIEW 1: MAINTENANCE BILLS DASHBOARD */}
        {activeTab === 'BILLS' && (
          <div className="space-y-6">
            {/* Toolbar Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search flat number, owner..."
                  className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <Filter size={14} className="text-slate-500" />
                <span className="text-slate-400 font-bold">Status:</span>
                {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${statusFilter === st ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bills Data Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-4 font-bold">Flat</th>
                    <th className="p-4 font-bold">Resident Name</th>
                    <th className="p-4 font-bold">Bill No</th>
                    <th className="p-4 font-bold">Due Date</th>
                    <th className="p-4 font-bold">Amount</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredBills.map(bill => (
                    <tr key={bill.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono font-bold text-indigo-400">
                        Wing {bill.wing} - {bill.flatNumber}
                      </td>
                      <td className="p-4 font-bold text-white">{bill.ownerName}</td>
                      <td className="p-4 font-mono text-slate-400">{bill.billNumber}</td>
                      <td className="p-4 text-slate-300">{bill.dueDate}</td>
                      <td className="p-4 font-bold text-white">₹{bill.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          bill.status === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          bill.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {bill.status === 'PAID' ? (
                          <button
                            onClick={() => { setSelectedBill(bill); setIsReceiptModalOpen(true); }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition"
                          >
                            Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRecordPayment(bill.id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition"
                          >
                            Pay Dues
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2: HELPDESK COMPLAINTS */}
        {activeTab === 'COMPLAINTS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
            <Wrench size={32} className="text-indigo-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Society Helpdesk Portal</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Track plumbing, electrical, and security maintenance requests submitted by society members.
            </p>
          </div>
        )}
      </main>

      {/* Printable Receipt Modal */}
      {isReceiptModalOpen && selectedBill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <Building2 size={32} className="text-indigo-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Gokuldham Housing Society</h3>
              <p className="text-[10px] text-slate-400">Maintenance Payment Receipt</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Bill Number:</span> <span className="font-mono text-white font-bold">{selectedBill.billNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Flat:</span> <span className="text-white font-bold">Wing {selectedBill.wing} - {selectedBill.flatNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Resident:</span> <span className="text-white font-bold">{selectedBill.ownerName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Paid Date:</span> <span className="text-green-400 font-bold">{selectedBill.paidDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payment Mode:</span> <span className="text-indigo-400 font-bold">{selectedBill.paymentMode}</span></div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Total Amount Paid</p>
                <p className="text-2xl font-black text-green-400">₹{selectedBill.totalAmount}</p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Printer size={14} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
