Implementing authentication securely in full-stack applications requires a clear strategy. Here’s a **step-by-step guide** to handle authentication using **JWT** and **HttpOnly cookies**.

---

## **Overview of the Solution**

1. **Back-End: Node.js with Express**
   - Authenticate users and generate JWTs.
   - Store the token securely in an HttpOnly cookie.

2. **Front-End: React**
   - Make authenticated API calls using the cookie.
   - Handle authentication states (e.g., logged in or not).

3. **Security Enhancements**
   - Use HTTPS in production.
   - Protect against CSRF attacks.
   - Implement proper error handling and token expiry.

---

## **Step 1: Set Up the Back-End**

### **1. Install Dependencies**
```bash
mkdir auth-demo-backend
cd auth-demo-backend
npm init -y
npm install express jsonwebtoken cookie-parser bcrypt cors body-parser dotenv
```

### **2. Create the Express Server**
```javascript
// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// In-memory user store (replace with a DB in production)
const users = [];

// Helper Functions
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Routes
// 1. Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email and password are required.');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, password: hashedPassword };
  users.push(user);

  res.status(201).send('User registered successfully.');
});

// 2. Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).send('Invalid email or password.');

  const token = generateToken(user);

  // Set the token as an HttpOnly cookie
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).send('Login successful.');
});

// 3. Protected Route
app.get('/profile', (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).send('Access denied.');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Welcome!', user });
  } catch (err) {
    res.status(403).send('Invalid token.');
  }
});

// 4. Logout
app.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.status(200).send('Logged out successfully.');
});

// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```

---

## **Step 2: Set Up the Front-End**

### **1. Create a React App**
```bash
npx create-react-app auth-demo-frontend
cd auth-demo-frontend
npm install axios
```

### **2. Build the Authentication Logic**
Update the `App.js` file:

```javascript
// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  const register = async () => {
    await axios.post('http://localhost:5000/register', { email: 'test@example.com', password: '123456' });
    alert('User registered. Now login!');
  };

  const login = async () => {
    await axios.post('http://localhost:5000/login', { email: 'test@example.com', password: '123456' });
    alert('Logged in!');
    fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/profile', { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      alert('You are not logged in.');
    }
  };

  const logout = async () => {
    await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
    setUser(null);
    alert('Logged out!');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Authentication Demo</h1>
      {!user ? (
        <>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </>
      ) : (
        <>
          <h2>Welcome, {user.email}!</h2>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default App;
```

---

## **Step 3: Configure CORS**

Update the back-end to allow requests from the React front-end:
```javascript
const cors = require('cors');

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
```

---

## **Step 4: Security Best Practices**

1. **Use HTTPS**: Always use HTTPS in production to encrypt communication.
2. **Secure Cookies**: Set the `secure` flag on cookies in production.
3. **Environment Variables**:
   - Create a `.env` file in the back-end:
     ```
     JWT_SECRET=your_secret_key
     NODE_ENV=development
     ```
4. **CSRF Protection**: Use libraries like `csurf` to prevent CSRF attacks.
5. **Rate Limiting**: Protect against brute-force attacks with libraries like `express-rate-limit`.

---

## **Step 5: Deployment**

1. Deploy the **back-end** to a service like Render, Heroku, or AWS.
2. Deploy the **front-end** to a service like Netlify or Vercel.
3. Update CORS settings and environment variables accordingly.

---

## **Conclusion**

With JWT and HttpOnly cookies, you've created a secure and scalable authentication system. By following these steps, you reduce vulnerabilities like XSS and CSRF while ensuring a smooth user experience. 🎉

### **Next Steps**
- Add **role-based access control (RBAC)**.
- Implement **password reset flows**.
- Support **OAuth2** for social login (e.g., Google, GitHub).