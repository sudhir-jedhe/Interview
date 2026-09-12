/**
 * Kept as the name most of the app already imports.
 *
 * The implementation moved to `useStoredState`, which handles both storage
 * scopes — see `lib/storage.ts` for the rule that decides which a value
 * belongs in. `useLocalStorage` is now precisely "a preference": it survives
 * the browser closing and it is shared across tabs.
 *
 * Anything that is a POSITION rather than a preference — a search term, a
 * page number, the country you are currently filtering by — should use
 * `useSessionState` instead.
 */

export { usePreference as useLocalStorage, useSessionState, useStoredState } from './useStoredState';
