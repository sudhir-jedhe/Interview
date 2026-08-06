Single Sign-On (SSO) allows users to authenticate once and gain access to multiple applications without needing to log in again for each application. In this implementation, we'll demonstrate how to set up an SSO system using **React** (for the frontend) and **Node.js** (for the backend). We'll use **OAuth2** or **OpenID Connect** as the authentication protocol, which are the common standards for SSO integrations.

We’ll cover:

1. **Frontend (React)**: How to initiate the authentication flow (redirecting to an identity provider, such as Google or Auth0).
2. **Backend (Node.js)**: How to set up the backend to handle the OAuth2/OpenID authentication callback and issue JWT tokens to the frontend.

### **High-Level Overview**

1. **Identity Provider (IDP)**: The authentication service (Google, Facebook, Auth0, etc.) that will manage user credentials and provide authentication tokens (like JWT).
2. **Frontend (React)**: Redirect the user to the Identity Provider’s login page, then handle the authentication callback to get the access token and use it for making requests.
3. **Backend (Node.js)**: Handle the OAuth2/OpenID callback from the IDP, verify the token, and issue a session or JWT token to maintain user authentication.

### **Step-by-Step Guide:**

---

### **1. Set Up the Identity Provider (IDP)**

First, you need to set up an Identity Provider that supports OAuth2 or OpenID Connect. For this example, we'll use **Google OAuth2**.

- **Create a project in Google Developer Console**:
  - Go to [Google Developer Console](https://console.developers.google.com/).
  - Create a new project.
  - Enable the **OAuth 2.0 API**.
  - Set the **redirect URI** to the URI where Google will redirect the user after successful authentication (e.g., `http://localhost:5000/auth/callback`).
  - Get the **Client ID** and **Client Secret** from the credentials section.

---

### **2. Backend Setup (Node.js with Express)**

We'll set up a simple Node.js server using **Express** to handle OAuth2/OpenID authentication.

1. **Install dependencies**:

```bash
npm init -y
npm install express axios passport passport-google-oauth20 cookie-session
```

1. **Backend Code (Node.js - Express)**:

Create a file named `server.js`:

```javascript
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const axios = require('axios');

const app = express();

// Middleware for cookie session (to store the user's session)
app.use(cookieSession({
  name: 'session',
  keys: ['your-session-key'], // Secret key for encrypting the session
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure the Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google client ID
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your Google client secret
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, (token, tokenSecret, profile, done) => {
  // Store the user profile in the session
  return done(null, profile);
}));

// Serialize the user profile into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user profile from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Route to start the OAuth login process
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route for Google OAuth
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/profile');
  }
);

// Protect the /profile route with authentication
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user); // Return the user profile as a JSON response
});

// Start the Express server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
```

### **Explanation of Backend Code:**

1. **Passport.js** is used to handle the OAuth authentication.
2. **GoogleStrategy** is configured with your Google Client ID, Client Secret, and the callback URL.
3. When the user accesses `/auth/google`, they are redirected to Google’s login page.
4. After successful authentication, Google will redirect to the `/auth/google/callback` URL, where Passport will handle the response and store the user's profile in the session.
5. The `/profile` route is a protected route that checks if the user is authenticated before displaying their profile information.

---

### **3. Frontend Setup (React)**

Now, let’s set up the **React frontend** to initiate the login flow and handle the authentication response.

1. **Install Axios**:

```bash
npm install axios
```

1. **React Code (Frontend)**:

Create a simple React component to start the authentication process:

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  // Function to check if the user is logged in
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      console.log('User not authenticated', error);
    }
  };

  // Log out the user
  const logout = async () => {
    await axios.get('http://localhost:5000/logout', { withCredentials: true });
    setUser(null);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="App">
      <h1>React + Node.js SSO Example</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <a href="http://localhost:5000/auth/google">Login with Google</a>
        </div>
      )}
    </div>
  );
}

export default App;
```

### **Explanation of React Code:**

1. **User State**: We store the logged-in user's information in the `user` state.
2. **`checkLoginStatus`**: This function checks if the user is logged in by making a request to the `/profile` route on the backend. If the user is authenticated, it sets the user state.
3. **Login Button**: When the user clicks "Login with Google", they are redirected to the Google OAuth flow handled by the backend.
4. **Logout**: A simple `logout` function that makes a request to a `/logout` endpoint on the backend, logging the user out.

---

### **4. Complete Backend: Handle Logout (Optional)**

If you want to implement a logout feature, you can handle it like this on the backend:

```javascript
// Handle logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});
```

---

### **5. Testing the Application**

1. Start your Node.js backend server:

```bash
node server.js
```

1. Start your React application:

```bash
npm start
```

1. Visit `http://localhost:3000` in your browser.
2. Click "Login with Google" to initiate the authentication flow.
3. After logging in with Google, you should see the user's profile displayed in the React frontend.

---

### **Conclusion**

In this guide, we set up an SSO system using **OAuth2** with **Google** as the Identity Provider and implemented it using **React** for the frontend and **Node.js** for the backend. By leveraging Passport.js and OAuth2, we simplified the authentication process and allowed the user to authenticate once and gain access to multiple applications.

You can easily extend this to support other OAuth2 providers (like Facebook, GitHub, Auth0, etc.) by configuring different strategies in Passport.js.
