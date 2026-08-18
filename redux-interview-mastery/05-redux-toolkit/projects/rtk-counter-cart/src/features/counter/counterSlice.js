import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  step: 1,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += state.step;
    },
    decrement(state) {
      state.value -= state.step;
    },
    incrementByAmount(state, action) {
      state.value += action.payload;
    },
    stepChanged(state, action) {
      state.step = action.payload;
    },
    reset(state) {
      state.value = initialState.value;
    },
  },
});

export const { increment, decrement, incrementByAmount, stepChanged, reset } =
  counterSlice.actions;

// Selectors co-located with the slice that owns this data
export const selectCounterValue = (state) => state.counter.value;
export const selectCounterStep = (state) => state.counter.step;

export default counterSlice.reducer;
