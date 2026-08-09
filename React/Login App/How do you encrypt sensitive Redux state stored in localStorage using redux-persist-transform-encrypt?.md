To encrypt sensitive Redux state stored in `localStorage` when using `redux-persist`, you can use the **`redux-persist-transform-encrypt`** package. Transforms allow `redux-persist` to intercept state slices and encrypt them *before* writing to storage, and decrypt them *after* reading from storage during rehydration.

---

### Step 1: Install Dependencies

Install `redux-persist-transform-encrypt` alongside `redux-persist`:

```bash
npm install redux-persist-transform-encrypt redux-persist @reduxjs/toolkit react-redux

```

---

### Step 2: Configure Encrypted Transform in Redux Store (`app/store.js`)

Create an encryption transform using `encryptTransform` and pass it to the `transforms` array inside your `persistConfig`.

```javascript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import authReducer from '../features/auth/authSlice';
import userSettingsReducer from '../features/settings/settingsSlice';

// 1. Create the Encryption Transform
const encryptor = encryptTransform({
  secretKey: process.env.REACT_APP_REDUX_SECRET_KEY || 'my-super-secret-key-123',
  onError: function (error) {
    // Handle decryption/encryption errors (e.g., secret key changed)
    console.error('Redux Persist Encryption Error:', error);
  },
});

// 2. Configure Redux Persist with Transforms
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Persist only auth slice (optional)
  transforms: [encryptor], // Pass the encryption transform here
};

// 3. Combine Reducers & Setup Store
const rootReducer = combineReducers({
  auth: authReducer,
  settings: userSettingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

```

---

### Step 3: Set Environment Secret Variable (`.env`)

Always store your encryption secret key in an environment variable rather than hardcoding it into source files:

```env
REACT_APP_REDUX_SECRET_KEY=your_strong_32_character_secret_key_here

```

---

### How It Works in `localStorage`

Before encryption, `localStorage.getItem('persist:root')` holds plain JSON:

```json
/* UNENCRYPTED (Plaintext) */
{"auth":"{\"user\":{\"email\":\"user@example.com\"},\"token\":\"eyJhbGciOi...\"}"}

```

With `redux-persist-transform-encrypt` applied, `localStorage` holds AES-encrypted ciphertext:

```json
/* ENCRYPTED (Ciphertext) */
{"auth":"U2FsdGVkX19R8q3...encrypted_base64_blob_here..."}

```

---

### Important Considerations for Production

1. **Client Secret Key Limitations:** Because JavaScript runs in the user's browser, any `secretKey` embedded in frontend code can technically be extracted by a motivated user. This encryption primarily protects against **casual physical access**, **cross-site script snooping**, and **local filesystem inspection**.
2. **Key Rotation/Changes:** If you change your `secretKey` in a future app update, existing users will fail decryption. Handle this gracefully in `onError` by purging the state or prompting a re-login:

```javascript
const encryptor = encryptTransform({
  secretKey: process.env.REACT_APP_REDUX_SECRET_KEY,
  onError: (error) => {
    // Clear invalid encrypted state if decryption fails
    localStorage.removeItem('persist:root');
  },
});

```
