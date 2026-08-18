// createAsyncThunk generates pending/fulfilled/rejected action creators automatically.
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_arg, { rejectWithValue }) => {
    const response = await fetch('/api/todos');
    if (!response.ok) {
      return rejectWithValue({ status: response.status, message: 'Failed to load todos' });
    }
    return response.json(); // -> action.payload on fulfilled
  }
);

// Generated action creators, available without you writing them:
console.log(fetchTodos.pending);   // (arg) => ({ type: 'todos/fetchTodos/pending', ... })
console.log(fetchTodos.fulfilled); // (payload, requestId, arg) => ({ type: 'todos/fetchTodos/fulfilled', payload, ... })
console.log(fetchTodos.rejected);  // (error, requestId, arg, payload) => ({ type: 'todos/fetchTodos/rejected', ... })

console.log(fetchTodos.typePrefix); // 'todos/fetchTodos'
