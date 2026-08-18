// The standard "typed hooks" convention for TypeScript projects — shown
// here in plain JS for runnability, with comments on the TS version.
import { useDispatch, useSelector } from 'react-redux';

// hooks.js — a project-local wrapper, imported everywhere instead of the
// raw react-redux hooks. In TypeScript:
//   export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
//   export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Usage elsewhere in the app is identical at runtime:
// import { useAppDispatch, useAppSelector } from './hooks';
// function MyComponent() {
//   const dispatch = useAppDispatch();
//   const count = useAppSelector((state) => state.counter.count);
//   ...
// }
