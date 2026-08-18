// Extending (not replacing) configureStore's default middleware.
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const loggerMiddleware = (store) => (next) => (action) => {
  console.log('dispatching', action.type);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // this action legitimately carries a File object; don't warn about it
        ignoredActions: ['uploads/setFile'],
        ignoredPaths: ['uploads.currentFile'],
      },
      immutableStateInvariantCheck: true, // on by default in dev, shown for clarity
    }).concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
