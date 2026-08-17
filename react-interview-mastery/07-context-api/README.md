# Context API

React's Context API lets you pass data through the component tree without manually threading props through every intermediate layer ("prop drilling"). This topic covers the mechanics of `createContext`, `Provider`, and `useContext`, and — critically for interviews — the re-render cost of Context: every component that consumes a context re-renders whenever the provided value changes, even if it only reads one field of a larger object. You'll see patterns for splitting contexts to limit that blast radius, and how to pair Context with `useReducer` to build a lightweight, Redux-like state container without external dependencies.

## What's covered
- `createContext`, `<Context.Provider value={...}>`, and `useContext(Context)` mechanics
- Why Context exists: eliminating prop drilling through many layers
- The re-render cost: all consumers re-render on any value change, regardless of which part they read
- Splitting contexts (e.g. state context vs dispatch context) to limit unnecessary re-renders
- Context vs prop drilling vs external state libraries — when each is the right tool
- Combining `useContext` + `useReducer` for a mini global-state pattern

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
