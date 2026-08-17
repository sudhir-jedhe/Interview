# Source Map — js_polyfills/React → this repo

Your `React` folder is huge and notably different in character from your JS folder: it's less "textbook notes" and more "real interview questions + machine-coding challenges + build-it-yourself component exercises." That's genuinely valuable and worth working through by hand — it wasn't bulk-copied here.

**Physically copied** (8 files, in `from-your-notes/` under the matching topic):

| File | Copied into |
|---|---|
| How do you handle asynchronous data loading in React applications?.md | `15-data-fetching-patterns/from-your-notes/` |
| How does React reconciliation decide what to update?.md | `11-rerenders-performance/from-your-notes/` |
| What does re-rendering mean in React?.md | `11-rerenders-performance/from-your-notes/` |
| How would you handle routing in a React single-page application?.md | `14-react-router/from-your-notes/` |
| lazy loading in React.md | `16-suspense-code-splitting/from-your-notes/` |
| presentational vs container component pattern in React.md | `18-design-patterns-anti-patterns/from-your-notes/` |
| React Frontend Architecture.md | `18-design-patterns-anti-patterns/from-your-notes/` |
| React Hydration.md | `17-react-18-19-features/from-your-notes/` |

**Mapped — check these folders by hand, they're worth it:**

| New topic | Check in `js_polyfills/React/` |
|---|---|
| `01-jsx-rendering-basics` | `What is reconciliation?.md`, `Explain how React reconciliation decides whether to reuse or recreate components.md` |
| `02-components-props` | `Component pattern/`, `Breadcrumbs Products/` |
| `03-state-usestate` | `UseState/` |
| `04-useeffect-lifecycle` | `Hooks/` |
| `05-event-handling-forms` | `Job Portal Form/`, `Login App/`, `PhoneInput/`, `Autocomplete/` |
| `06-lists-keys-conditional-rendering` | *your "filterable and sortable data table" build challenge (unicode-styled filename), `Table Component/`* |
| `07-context-api` | `Authentication/` |
| `08-useref-dom-access` | `Explain Callback Refs vs useRef, how Callback Refs trigger on mount...md` |
| `09-usememo-usecallback` | `optimaztion/`, `Optimize/` |
| `10-custom-hooks` | `Hooks/`, `CustomTimePicker/` |
| `11-rerenders-performance` | `Virtuliazed/`, `Timer/` |
| `13-error-boundaries` | `How do you combine React Suspense with Error Boundaries for clean asynchronous data fetching?.md` |
| `14-react-router` | `Router/`, `Role based nested routing/` |
| `15-data-fetching-patterns` | `RestAPI/`, *your "centralized API layer with global error handling, authentication" note (unicode-styled filename)*, *your "rate limiter/throttling logic for a button click" build challenge* |
| `16-suspense-code-splitting` | — |
| `17-react-18-19-features` | `React 19/` |
| `18-design-patterns-anti-patterns` | `Component pattern/`, *your "Slot pattern in React using Radix UI Slot" note* |
| *(not covered here — has its own repo/folder)* | `Redux and Redux Toolkit (RTK)/` → see the Redux repo. `System Design/` → see the System Design repo. `Machine Codding/`, `challenges/`, `brain-teaser-game/`, `chessBoard/`, `pixelArtGrid/`, `Dropdown/`, `DatePicker/`, `ImageCarousel/`, `Stepper/`, `FolderToggle/`, `Crud/`, `LoadingIndicator/` → hands-on build practice, complements every topic above — do these after you've reviewed the matching notes |
| *(infra, not core React)* | `Complete MERN/` (own MERN scope), `setup/`, the GitHub Actions/CI/Sentry/AWS deploy note → DevOps repo |

Some filenames in your React folder use stylized unicode characters (𝗕𝗼𝗹𝗱 𝗹𝗼𝗼𝗸𝗶𝗻𝗴 𝘁𝗲𝘅𝘁, likely pasted from LinkedIn posts) — they didn't copy cleanly here, but they're real files sitting in your React folder root worth opening directly: things like "How would you build a filterable and sortable data table?", "How would you build a rate limiter or throttling logic for a button click?", and "How would you design a favorite/bookmark button?" — all excellent scenario-style practice that pairs well with `05-scenario-questions.md` files in this repo.
