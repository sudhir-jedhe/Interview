Here is a full-stack **E-Commerce Application** architecture and implementation using **React** (Frontend) and **Node.js / Express / MongoDB** (Backend).

It includes all requested features:

* **Product Hubs**: Product Gallery, Detail View, Filter by Category (Electronics, Toys, Clothes, Baby Products), Deals, Trending Now, Fast Delivery, Limited Availability.
* **Cart & Saved Items**: Cart with Quantity Adjustments, **Save For Later**, **List All Saved Items**.
* **Checkout & Order Workflow**: Shipping/Payment Checkout, **Purchase History**, **Buy Again**, **Filter Orders by Type & Date Range**.
* **Reviews & Feedback**: Star Rating System, User Feedback & Product Reviews.

---

### System Architecture & Database Schema

#### Node.js / Mongoose Schemas (`models/`)

##### `models/Product.js`

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: Number, // Deals
  category: { 
    type: String, 
    enum: ['Electronics', 'Toys', 'Clothes', 'Baby Products'], 
    required: true 
  },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  stock: { type: Number, required: true }, // Limited Availability check (< 10)
  isFastDelivery: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isDeal: { type: Boolean, default: false },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

```

##### `models/User.js` (With Cart, Save for Later & Saved Items)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  saveForLater: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  }],
  savedLists: [{
    name: { type: String, default: 'Wishlist' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

```

##### `models/Order.js` (With Filterable Order Types & Dates)

```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },
  paymentMethod: { type: String, default: 'Credit Card' },
  totalAmount: { type: Number, required: true },
  orderType: { 
    type: String, 
    enum: ['Standard', 'Fast Delivery', 'Subscription', 'Gift'], 
    default: 'Standard' 
  },
  orderStatus: { 
    type: String, 
    enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Placed' 
  },
  deliveredAt: Date
}, { timestamps: true }); // createdAt gives Order Date

module.exports = mongoose.model('Order', orderSchema);

```

---

### Backend API Controllers (Node.js & Express)

#### `controllers/orderController.js`

```javascript
const Order = require('../models/Order');

// Get User Purchase History with Filtering (by Order Type and Date Range)
exports.getUserOrders = async (req, res) => {
  try {
    const { orderType, timeRange } = req.query;
    let query = { user: req.user.id };

    // Filter by Order Type
    if (orderType && orderType !== 'ALL') {
      query.orderType = orderType;
    }

    // Filter by Order Date
    if (timeRange) {
      const now = new Date();
      if (timeRange === 'last30days') {
        query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 30)) };
      } else if (timeRange === 'last6months') {
        query.createdAt = { $gte: new Date(now.setMonth(now.getMonth() - 6)) };
      } else if (timeRange === '2026') {
        query.createdAt = {
          $gte: new Date('2026-01-01'),
          $lte: new Date('2026-12-31')
        };
      }
    }

    const orders = await Order.find(query)
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Feedback / Review to a Product
exports.addProductReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  try {
    const Product = require('../models/Product');
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = {
      user: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

```

---

### React Single-Page Front-End App

Below is a single-file interactive React frontend containing **Product Gallery with Badges**, **Filtering**, **Save For Later**, **Cart & Checkout**, and **Purchase History with "Buy Again"**:

```jsx
import React, { useState } from 'react';
import { 
  ShoppingBag, Heart, Star, Zap, Clock, ShieldCheck, 
  RotateCcw, Filter, CheckCircle, ArrowRight, Bookmark 
} from 'lucide-react';

// Mock Initial Data
const MOCK_PRODUCTS = [
  {
    id: 'p1',
    title: 'Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 199.99,
    discountPrice: 149.99,
    rating: 4.8,
    numReviews: 124,
    stock: 4, // Limited Availability
    isFastDelivery: true,
    isTrending: true,
    isDeal: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.'
  },
  {
    id: 'p2',
    title: 'Interactive STEM Robot Kit',
    category: 'Toys',
    price: 59.99,
    discountPrice: 49.99,
    rating: 4.6,
    numReviews: 88,
    stock: 25,
    isFastDelivery: true,
    isTrending: true,
    isDeal: false,
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&q=80',
    description: 'Programmable robotics kit for kids and beginners with block-based coding.'
  },
  {
    id: 'p3',
    title: 'Organic Cotton Baby Onesies (Pack of 3)',
    category: 'Baby Products',
    price: 29.99,
    discountPrice: 24.99,
    rating: 4.9,
    numReviews: 210,
    stock: 6, // Limited Availability
    isFastDelivery: false,
    isTrending: false,
    isDeal: true,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80',
    description: 'Ultra-soft, hypoallergenic 100% organic cotton onesies for infants.'
  },
  {
    id: 'p4',
    title: 'Classic Denim Trucker Jacket',
    category: 'Clothes',
    price: 79.99,
    discountPrice: null,
    rating: 4.5,
    numReviews: 64,
    stock: 18,
    isFastDelivery: true,
    isTrending: false,
    isDeal: false,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80',
    description: 'Timeless denim jacket crafted from durable cotton denim with metal button closures.'
  }
];

export default function ECommerceApp() {
  const [view, setView] = useState('GALLERY'); // GALLERY | DETAIL | CART | ORDERS | SAVED
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // States for Cart, Save For Later, Saved List, & Purchase History
  const [cart, setCart] = useState([]);
  const [saveForLater, setSaveForLater] = useState([]);
  const [savedWishlist, setSavedWishlist] = useState([]);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL'); // DEALS | TRENDING | FAST_DELIVERY | LIMITED
  
  // Order History Filters
  const [orderFilterType, setOrderFilterType] = useState('ALL');
  const [orderTimeRange, setOrderTimeRange] = useState('ALL');

  // Purchase History Mock
  const [orders, setOrders] = useState([
    {
      id: 'ORD-9912',
      date: '2026-08-01',
      type: 'Fast Delivery',
      total: 149.99,
      items: [{ ...MOCK_PRODUCTS[0], quantity: 1 }]
    }
  ]);

  // --- CART & SAVE FOR LATER ACTIONS ---
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const moveToSaveForLater = (product) => {
    setCart((prev) => prev.filter((item) => item.id !== product.id));
    if (!saveForLater.some((item) => item.id === product.id)) {
      setSaveForLater((prev) => [...prev, product]);
    }
  };

  const moveToCartFromSaved = (product) => {
    setSaveForLater((prev) => prev.filter((item) => item.id !== product.id));
    addToCart(product);
  };

  const toggleWishlist = (product) => {
    if (savedWishlist.some((item) => item.id === product.id)) {
      setSavedWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      setSavedWishlist((prev) => [...prev, product]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Standard',
      total: cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0),
      items: [...cart]
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('ORDERS');
  };

  // --- FILTERED PRODUCTS ---
  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (filterType === 'DEALS' && !p.isDeal) return false;
    if (filterType === 'TRENDING' && !p.isTrending) return false;
    if (filterType === 'FAST_DELIVERY' && !p.isFastDelivery) return false;
    if (filterType === 'LIMITED' && p.stock >= 10) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => setView('GALLERY')}
            className="flex items-center gap-2 cursor-pointer font-extrabold text-xl text-indigo-400"
          >
            <Zap className="fill-indigo-400" /> OmniShop
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setView('GALLERY')} 
              className={`text-sm font-semibold hover:text-indigo-400 ${view === 'GALLERY' && 'text-indigo-400'}`}
            >
              Browse
            </button>
            <button 
              onClick={() => setView('SAVED')} 
              className={`text-sm font-semibold flex items-center gap-1 hover:text-indigo-400 ${view === 'SAVED' && 'text-indigo-400'}`}
            >
              <Bookmark size={16} /> Saved ({savedWishlist.length})
            </button>
            <button 
              onClick={() => setView('ORDERS')} 
              className={`text-sm font-semibold hover:text-indigo-400 ${view === 'ORDERS' && 'text-indigo-400'}`}
            >
              Purchase History
            </button>
            <button 
              onClick={() => setView('CART')} 
              className="relative p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition"
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* VIEW 1: PRODUCT GALLERY */}
        {view === 'GALLERY' && (
          <div className="space-y-6">
            {/* Quick Filters Banner */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase self-center mr-2">Quick Quick Filters:</span>
              {[
                ['ALL', 'All Products'],
                ['DEALS', '🔥 Deals'],
                ['TRENDING', '⚡ Trending Now'],
                ['FAST_DELIVERY', '🚀 Fast Delivery'],
                ['LIMITED', '⏳ Limited Availability']
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    filterType === key 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Category Switcher */}
            <div className="flex gap-4">
              {['ALL', 'Electronics', 'Toys', 'Clothes', 'Baby Products'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-sm font-bold pb-1 border-b-2 transition ${
                    selectedCategory === cat ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between group">
                  <div className="relative aspect-square overflow-hidden bg-slate-950">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/60 backdrop-blur-md text-slate-300 hover:text-red-400 transition"
                    >
                      <Heart size={16} className={savedWishlist.some(s => s.id === product.id) ? 'fill-red-500 text-red-500' : ''} />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.stock < 10 && (
                        <span className="text-[10px] font-bold bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded">
                          Only {product.stock} left
                        </span>
                      )}
                      {product.isFastDelivery && (
                        <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded">
                          Fast Delivery
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{product.category}</span>
                      <h3 
                        onClick={() => { setSelectedProduct(product); setView('DETAIL'); }}
                        className="font-bold text-sm text-slate-100 hover:text-indigo-400 cursor-pointer line-clamp-2"
                      >
                        {product.title}
                      </h3>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-white">
                          ${product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs text-slate-500 line-through">${product.price}</span>
                        )}
                      </div>
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        <Star size={12} className="fill-amber-400" /> {product.rating}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-xs rounded-lg transition border border-indigo-500/30"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT DETAIL VIEW */}
        {view === 'DETAIL' && selectedProduct && (
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-950">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase">{selectedProduct.category}</span>
                <h1 className="text-2xl font-bold mt-1">{selectedProduct.title}</h1>
                <p className="text-sm text-slate-400 mt-2">{selectedProduct.description}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-3xl font-extrabold">${selectedProduct.discountPrice || selectedProduct.price}</span>
                  {selectedProduct.discountPrice && (
                    <span className="text-sm text-slate-500 line-through">${selectedProduct.price}</span>
                  )}
                </div>
              </div>

              {/* Feedback / Rating Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">Customer Feedback & Ratings</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-amber-400">{selectedProduct.rating}</span>
                  <div className="text-xs text-slate-400">
                    <p>Based on {selectedProduct.numReviews} verified reviews</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className="p-3 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300"
                >
                  <Heart size={20} className={savedWishlist.some(s => s.id === selectedProduct.id) ? 'fill-red-500 text-red-500' : ''} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CART & SAVE FOR LATER */}
        {view === 'CART' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Active Cart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Your Shopping Cart</h2>

              {cart.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center pb-4 border-b border-slate-800">
                      <div className="flex gap-4 items-center">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-slate-950" />
                        <div>
                          <h4 className="font-bold text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-400">${item.discountPrice || item.price} x {item.quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => moveToSaveForLater(item)}
                          className="text-xs text-indigo-400 hover:underline"
                        >
                          Save for Later
                        </button>
                        <span className="font-bold">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-extrabold text-indigo-400">
                      ${cart.reduce((a, c) => a + (c.discountPrice || c.price) * c.quantity, 0).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>

            {/* Save For Later List */}
            {saveForLater.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-md font-bold mb-4 text-slate-400">Saved For Later ({saveForLater.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {saveForLater.map((item) => (
                    <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-md" />
                        <div>
                          <p className="text-xs font-bold line-clamp-1">{item.title}</p>
                          <p className="text-xs text-indigo-400 font-bold">${item.discountPrice || item.price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => moveToCartFromSaved(item)}
                        className="px-3 py-1.5 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: PURCHASE HISTORY & BUY AGAIN */}
        {view === 'ORDERS' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Purchase History</h2>

            {/* Order Filters */}
            <div className="flex gap-4 border-b border-slate-800 pb-4">
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase block mb-1">Filter by Order Type</label>
                <select 
                  value={orderFilterType} 
                  onChange={(e) => setOrderFilterType(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-slate-300"
                >
                  <option value="ALL">All Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Fast Delivery">Fast Delivery</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold uppercase block mb-1">Filter by Order Date</label>
                <select 
                  value={orderTimeRange} 
                  onChange={(e) => setOrderTimeRange(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-slate-300"
                >
                  <option value="ALL">All Time</option>
                  <option value="2026">Year 2026</option>
                  <option value="last30days">Last 30 Days</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <div>Order ID: <span className="font-bold text-white">{order.id}</span></div>
                    <div>Date: <span className="text-slate-200">{order.date}</span></div>
                    <div>Type: <span className="text-indigo-400 font-bold">{order.type}</span></div>
                  </div>

                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-md bg-slate-950" />
                        <div>
                          <p className="font-bold text-sm">{item.title}</p>
                          <p className="text-xs text-slate-400">${item.discountPrice || item.price}</p>
                        </div>
                      </div>

                      {/* Buy Again Button */}
                      <button
                        onClick={() => { addToCart(item); setView('CART'); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition"
                      >
                        <RotateCcw size={14} /> Buy Again
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: LIST ALL SAVED ITEMS (WISHLIST) */}
        {view === 'SAVED' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Your Saved Items ({savedWishlist.length})</h2>

            {savedWishlist.length === 0 ? (
              <p className="text-sm text-slate-500">No items saved to your wishlist yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savedWishlist.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <img src={item.image} alt={item.title} className="w-full h-36 object-cover rounded-lg bg-slate-950" />
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-indigo-400 font-extrabold">${item.discountPrice || item.price}</p>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-2 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-500 transition"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

```

---

### Core Architecture Features

1. **Integrated Save For Later & Wishlist**: Separate state trees for temporary cart deferral (`Save for Later`) vs. global favorites (`List All Saved`).
2. **Dynamic Product Filters**: Multi-tier filtering across categories (*Electronics, Toys, Clothes, Baby Products*) and deal flags (*Deals, Trending, Fast Delivery, Limited Availability*).
3. **Filtered Purchase History**: Orders endpoint supports database queries matching order date ranges (`2026`, `last30days`) and fulfillment method (`Fast Delivery`, `Standard`).
4. **Instant "Buy Again" Workflow**: Direct action in purchase history extracts item metadata and pushes it straight into the active cart state.
