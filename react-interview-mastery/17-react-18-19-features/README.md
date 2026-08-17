# React 18/19 Features

React 18 introduced concurrent rendering as an opt-in capability that changes how and when React commits updates to the screen, unlocking `useTransition` and `useDeferredValue` for marking work as non-urgent, plus automatic batching everywhere (not just inside event handlers). React 19 pushed further into Server Components and formalized patterns like the `"use client"`/`"use server"` directives that are now common interview topics even though the ecosystem around them (frameworks, bundlers) is still catching up. This topic covers the concepts you're expected to explain clearly — what problem each feature solves and what changes in behavior you should expect — rather than obscure API trivia.

## What's covered
- Concurrent rendering (interruptible, not "faster")
- `useTransition` for marking updates as non-urgent
- `useDeferredValue`
- Automatic batching in React 18 (including outside event handlers)
- React Server Components at a conceptual level
- The `"use client"` / `"use server"` directives
- `useId`
- `useSyncExternalStore` (briefly)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
