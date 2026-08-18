// createSlice generates action creators + action types + a reducer, all in one call.
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // looks like a mutation; Immer makes it safe
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

// Sanity check when run directly:
if (require.main === module) {
  let state = counterSlice.reducer(undefined, { type: '@@INIT' });
  console.log(state); // { value: 0 }

  state = counterSlice.reducer(state, increment());
  console.log(state); // { value: 1 }

  state = counterSlice.reducer(state, incrementByAmount(5));
  console.log(state); // { value: 6 }

  console.log(increment()); // { type: 'counter/increment', payload: undefined }
  console.log(incrementByAmount(5)); // { type: 'counter/incrementByAmount', payload: 5 }
}
