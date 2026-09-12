# Spiro Admin — EV fleet & battery operations console

A React 19 + TypeScript admin application built from scratch: authentication,
authorization, routing, global search, tables with search/filter/sort/paginate/
select, CRUD, CSV and PDF export, a collapsible icon rail, breadcrumbs, live
maps, and a chart set built from raw SVG — on top of a live telemetry feed,
geofencing, trip playback, over-the-air commands, swap-station management,
battery degradation forecasting, predictive maintenance and an audit trail.

It runs with **no backend and no API keys**. A seeded mock generator produces a
stable fleet at startup, and the maps use OpenStreetMap raster tiles through
MapLibre GL.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build
```

## Demo accounts

Password for all three is `spiro`. Sign in as different roles to watch the
navigation and the available actions change.

| Email | Role | What changes |
|---|---|---|
| `admin@spiro.com` | Admin | Everything except creating users |
| `operator@spiro.com` | Operator | Commands one vehicle; **no** bulk commands, **no downloads**, cannot move an alarm threshold |
| `viewer@spiro.com` | Viewer | Read-only; no commands, **no downloads**, no riders, no audit |

Downloads are one capability, `data:export`, held by super admins and admins
only. It covers every format everywhere — a PDF of the fleet is no less
sensitive than a CSV of it — and importing is gated separately on the same
permission that lets you create the record by hand (`vehicle:manage` /
`user:manage`). Sign in as the operator to see every Download button
disappear.

## What is where

```
src/
  types/domain.ts        the contract every other layer depends on
  lib/mock/generator.ts  seeded (mulberry32) fleet, batteries and users
  lib/api/client.ts      the ONLY module that "talks to the network"
  lib/utils/             formatting, CSV/JSON export, classnames
  hooks/                 useAsync, useTable, useDebounce, useLocalStorage,
                         useMediaQuery, useOnClickOutside, useTheme
  features/auth/         AuthProvider, permissions table, route guards, login
  features/dashboard/    fleet overview
  features/vehicles/     tracking map, asset table, vehicle detail
  features/batteries/    battery table, battery detail + history
  features/users/        directory, CRUD, and the permission model made visible
  features/telematics/   the live feed wall — map, packet log, feed health
  features/geofences/    operating and exclusion zones
  features/alarms/       the alarm engine, alarm centre, banner, WebAudio chime
  features/stations/     swap cabinet network
  features/riders/       rider directory, KYC, earnings, emergency contact
  features/maintenance/  predictive flags with their evidence
  features/reports/      operational report, CSV + print-to-PDF
  features/audit/        who did what, including what failed
  lib/realtime/          the SSE-shaped feed client and its mock transport
  lib/geo/               point-in-polygon geofence testing
  lib/api/commands.ts    over-the-air commands
  lib/api/mutations.ts   every write, with validation and audit
  lib/audit.ts           the audit recorder
  lib/mock/db.ts         the mutable store behind useSyncExternalStore
  components/ui/         Button, Input, Select, Tabs, Table, Card, Badge,
                         Toast, States, Icon, ErrorBoundary
  components/charts/     Bar, Area, Donut, Proportion, Gauge (hand-built SVG)
  components/map/        MapLibre fleet map + speed legend
  components/layout/     rail, topbar, global search, breadcrumbs
  router/routes.tsx      lazy routes, guarded
  styles/tokens.css      design tokens, including the validated chart palette
```

## Decisions worth knowing about

**Authorization is permissions, not roles.** Components ask
`can('battery:export')`, never `role === 'admin'`. `features/auth/permissions.ts`
holds the single role→permission table; the Users screen renders that same
table, so the documentation cannot drift from what is enforced.

Two different guards, deliberately: `ProtectedRoute` redirects an anonymous
user to `/login`; `RequirePermission` renders a 403 **in place**. Bouncing a
signed-in user to the login screen because they lack one permission reads as
"you are logged out" and they retry forever.

**`useAsync` fixes the three bugs every hand-rolled fetch hook has.** A slow
earlier response cannot overwrite a fast later one, unmounting aborts the
request, and the fetcher lives in a ref so an inline arrow does not re-run the
effect on every render.

**`useTable` memoises each stage separately.** Typing one character in the
search box must not re-sort nine thousand rows whose sort key did not change.
It exposes both `rows` (the visible page) and `allMatchingRows` (everything the
filters matched) — export uses the latter, because exporting only page 1 is the
most common table-export bug.

**The chart palette was validated, not chosen by eye.** The first hand-picked
categorical set failed: green `#2e9e5b` against orange `#e8833a` measured
ΔE 3.5 under protanopia, well below the floor of 8. `tokens.css` now carries a
palette that passes the adjacent-pair CVD check, the normal-vision floor and the
contrast check against both the light (`#ffffff`) and dark (`#131a24`) surfaces.

Three source-screenshot patterns were corrected rather than copied:

- a two-slice donut became a proportion bar (a donut of two values is a
  worse bar chart);
- a ten-step rainbow ramp over the state-of-charge buckets became **one**
  colour — the x-axis already encodes charge, and past ~7 bins adjacent ramp
  steps are indistinguishable; only the two critical buckets take the reserved
  status colour, and the legend says so in words;
- a decorative gauge became a gauge with threshold bands and a written status
  label, so state is never carried by colour alone.

**The map is a GeoJSON source with clustering on, not DOM markers.** Fourteen
thousand markers would kill the page; a clustered source keeps the rendered
marker count constant. Every map calls `map.remove()` on unmount — browsers cap
live WebGL contexts at around 16, so a leaked map takes the app down after a
dozen navigations.

**Routes are lazy.** MapLibre alone is roughly 200 kB; the users screen should
not pay for it.

## Known limits

- Everything is in memory. A reload regenerates the same fleet (the PRNG is
  seeded) and discards every write made during the session, imports included.
- `.xls` (the old binary format) is not supported — only `.xlsx`. The dialog
  says so rather than failing obscurely.
- The feed is a mock transport, not a server. It mutates the fleet in place so
  the map, tables and feed cannot disagree — a real deployment would receive
  the same frames over SSE and never mutate locally.
- Firmware and curfew commands are modelled end to end but do not carry a
  payload; there is no image to push at.
- Degradation history is synthesised from each pack's current SOH and cycle
  count rather than recorded over time, so the curve is representative of the
  shape, not of that specific pack's past.


## The telematics layer

**The live feed is SSE-shaped, not a WebSocket.** `lib/realtime/client.ts`
models EventSource because the traffic is one-directional: the platform pushes
telemetry, the browser never pushes back. That buys plain HTTP (which survives
proxies that quietly kill `ws://`), browser-managed reconnection, and
`Last-Event-ID` resume. The cost is that commands need their own path — and
they have one. `MockTransport` stands in for the server; pointing at a real
endpoint is one line:

```ts
export const realtime = new RealtimeClient(new EventSourceTransport('/api/stream'));
```

There is **one** client for the whole app. Ten components subscribing must not
mean ten connections, which is the classic way a live feed takes a browser down.

**Paint rate is decoupled from feed rate.** The mock pushes ~26 frames every
1.5 s. `useTelemetryMap` accumulates them in a ref and flushes on a fixed
cadence, so the map repaints on its own schedule rather than the network's.
Packet-log writes deliberately bypass the store's version counter for the same
reason — see the comment on `db.pushPackets`.

**Geofencing is ray-casting with a bounding-box pre-check.** It runs for every
vehicle on every frame, and the box rejects almost all of them in two
comparisons. Two failures are distinguished: leaving every *inclusion* zone for
your country, and entering an *exclusion* zone. A country with no zone defined
is unmonitored, not "outside" — otherwise deleting a fence floods the alarm
centre.

**Alarms are deduplicated with a cooldown.** A hot pack reports every 1.5 s;
without one alarm per subject-and-kind per five minutes, the alarm centre fills
with forty identical rows a minute and the operator stops reading it.
Thresholds are operator-editable and every change is audited. Sound is armed by
a button — browsers block audio without a gesture, and a console that beeps
unbidden gets muted at the OS, after which no alarm is ever heard again.

**Trip playback uses `requestAnimationFrame` and a time playhead**, not an
interval and an index. An interval drifts and keeps running in a background
tab; an index hops between 20-second samples instead of gliding. The position
is interpolated between the two samples either side of the current time, and
the readout row reads from the same interpolation as the map marker, so they
cannot disagree.

**Commands model failure honestly.** A command to an offline vehicle is
accepted and then times out, because that is what the field does — pretending
it worked is how a dispatcher comes to believe a stolen bike is locked.
Immobilisation is refused above 5 km/h in the platform, not left to an
operator's judgement. Bulk results are reported as two numbers ("18
acknowledged, 4 failed"), never as "done".

**Degradation forecasting fits the last third of the curve only.** Lithium
packs lose capacity fast, then slow, then fast again at the knee; fitting the
whole history flatters the pack and pushes the retirement date months out —
which is exactly the error that leaves you with a hundred dead packs and no
replacements ordered. The projection is drawn dashed and labelled, because a
solid line implies measurement.

**Clusters and heatmap are mutually exclusive.** Clusters answer "how many are
here"; a heatmap answers "where is the fleet concentrated". Stacking them
produces a picture that answers neither. Both are MapLibre's own GPU layers on
one clustered GeoJSON source — Supercluster would duplicate on the CPU what GL
JS already does on the GPU, so it is not a dependency here.

**PDF reports are the page, printed.** `styles/print.css` strips the rail,
topbar and controls and adds a title block; the browser's Save-as-PDF does the
rest. No PDF library to keep current, the report is inspectable on screen
first, and the output stays selectable text rather than a picture of a table.
The CO₂ figure prints its assumptions beside it — 87 g CO₂e/km for the petrol
motorcycle replaced, net of 25 g CO₂e/km for grid charging — because a carbon
number without a baseline is not a number.

**Everything that writes is audited, including what failed.** "Who tried to
immobilise the fleet at 02:00 and was refused" is the question an audit log
exists to answer, so failures are shown by default and the page has no edit, no
delete and no bulk clear.

## Tables

One hook, `useTable`, backs six tables. It adds to the earlier
search/filter/sort/paginate:

- **Selection by row id**, not index or object identity. Indices go stale the
  moment you sort; identity breaks the moment the data refetches. An id
  survives both — which is what lets you tick four bikes, change the filter,
  and still send the command to those four.
- **A three-state header checkbox.** "Some but not all" is a real state, and a
  checkbox showing only two of three lies about what clicking it will do.
- **`selectedRows` and `allMatchingRows`** exposed separately from the visible
  page, so a bulk command and an export each have to say which they mean.

Writes go through `lib/api/mutations.ts`, never straight into a component.
Validation lives there and the forms call the same functions, so a form can
never accept something the write would refuse. The IMEI rule is the one worth
reading: two vehicles sharing an IMEI silently corrupts every distance, energy
and utilisation figure downstream, and nothing in the UI would ever show you
why.


## Language

The Fr/En switch is a real translation layer (`src/i18n/`), not a stored
preference. `en` is the source of truth and `TranslationKey` is derived from
it, so `fr` is typed `Record<TranslationKey, string>` — adding an English
string without its French counterpart is a **compile error**, not a string
that quietly stays English for French users.

Beyond swapping words it sets `document.documentElement.lang` (so screen
readers switch pronunciation) and exposes the matching locale through
`useFormatters()`, because French wants a narrow no-break space for thousands
and DD/MM ordering — "1,234" and "9/13/2026" are wrong in French, not merely
untranslated.

What is translated: navigation, the topbar, the rail, table chrome and
pagination, page titles, status words, the login screen and the import dialog.
What is not: the long explanatory paragraphs on each page. Those are
documentation rather than interface, and a half-translated paragraph is worse
than an untranslated one.

## Importing data

Vehicles and users accept **CSV, JSON and .xlsx** — no parsing library. CSV is
parsed character by character (`line.split(',')` breaks on the first quoted
comma); .xlsx is a ZIP of XML, and the browser can already inflate a ZIP entry
via `DecompressionStream`, so the reader is ~120 lines rather than a 400 kB
dependency. If a browser lacks it, the dialog says so and asks for a CSV
instead of importing something silently wrong.

**Nothing is written until you have seen what would happen.** Choosing a file
produces a plan — rows read, new, already existing, duplicated within the
file, rejected — and the Import button only then does anything. Rejections are
listed by line number with the reason, because "12 rows rejected" is not
actionable and "line 47: an IMEI is exactly 15 digits" is.

Duplicates are caught in two places because they are two different problems:

- **within the file** — the same IMEI twice in one upload, usually two exports
  concatenated. The first occurrence wins.
- **against the database** — the record already exists. You choose: skip them
  (the default; nothing you already have is touched) or update them, field by
  field, into the audit trail.

Matching is on a **natural key**, never the row's `id` column — a file from
another system has its ids, not yours. For a vehicle that key is the IMEI plus
the registration; for a user it is the email. Headings are matched loosely, so
"Vehicle No", "vehicle_no" and "vehicleNo" all work and a file exported with
the Download button imports straight back in.

## What the browser stores

Both stores are used, and `lib/storage.ts` holds the one rule that decides
which:

- **`localStorage` — a PREFERENCE.** It is about the person and should still
  be true tomorrow, on this machine, in every tab: language, theme, which
  columns you show, alarm thresholds, whether the rail is pinned open, and the
  profile shell that stops a reload flashing an empty topbar.
- **`sessionStorage` — a POSITION.** It is about what you are doing right now
  and should die with the tab: the country you are filtering by, the search
  term, the column filters, the sort order, which page of a table you are on.

The distinction is not pedantry. Put a search term in `localStorage` and
someone opens the app tomorrow to a table mysteriously filtered to "EC28". Put
the theme in `sessionStorage` and every new tab flashes white. Both are the
same bug — state stored at the wrong lifetime — and making the choice in one
file rather than at each call site is what stops it recurring.

Cross-tab behaviour differs on purpose: preferences listen for the `storage`
event, so changing the theme in one tab changes it in the others. Session
state does not — two tabs are two workspaces, and filtering one to Pune must
not move the other.

**Settings → "What this browser is storing"** lists every key with its scope,
what it is for in words, and its size, plus separate buttons to clear the
session or reset preferences. Nothing operational is in either store: the
access token is in memory only, so a reload signs you out and nothing else on
the origin can read it.

Every access is wrapped — Safari's private mode throws on `setItem` rather
than failing quietly, and a corrupt value must never take the app down.


## Markets

Six now, including **India — the Pune metropolitan region**. Adding it was a
data change, not a code change: `COUNTRIES` drives every filter, `CITY_CENTRES`
places the map, and three lookup tables (`OPERATING_CITY`, `DIAL_CODE`,
`PLATE_PREFIXES`) supply the things that differ per market. Pune vehicles carry
MH-series registrations, riders get +91 numbers, and the operating zone is drawn
around the metro rather than the state.

Two things that had been quietly wrong got fixed with it: station naming was a
chain of ternaries that would have needed editing for every new market, and the
rider phone generator hard-coded Togo's +228 for everyone. Both are lookups now.

Selecting "All countries" spans West Africa **and** western India, so the
default map viewport moved accordingly — centring on Africa, as it did before,
would have hidden a whole region from anyone who left the filter alone.

## Exports

Every Download button is a menu with four destinations, all generated from the
same array of display rows so they cannot disagree:

| Format | Why |
|---|---|
| **CSV** | Opens anywhere. Loses types. |
| **Excel** (.xlsx) | Numbers stay numeric so they can be summed; ships with a frozen header row and an autofilter already applied. |
| **JSON** | For feeding another system — and it round-trips back through the import dialog unchanged. |
| **PDF** | Through your browser's print dialog, so it stays selectable text with a repeating header row rather than a picture of a table. |

**The .xlsx writer is ~200 lines and has no dependency.** An .xlsx is a ZIP of
XML, and the shortcut the spreadsheet libraries do not take is that *the ZIP
does not have to be compressed* — method 0 ("stored") is a legal entry that
Excel, Numbers, LibreOffice and Sheets all open. That removes the only hard
part, a deflate encoder, and leaves CRC-32 and some header structs. The cost is
file size, which for an operational export is a fair trade.

One rule worth knowing: a value is written as a number only if the source data
modelled it as a number. An IMEI is fifteen digits, and handing it to Excel as
a number returns it as `3.56938E+14` with the last digits gone for good — so
identifiers stay text.

## Tables

Every table header now does four things:

- **Sort** — click to cycle ascending → descending → unsorted. The third state
  is how you get back to the server's natural order.
- **Filter** — a second header row with a control per filterable column. It is
  a dropdown of the actual distinct values when there are 30 or fewer, and a
  text box past that, because a 400-entry dropdown is worse than typing. The
  options are computed from the *searched* rows, not the filtered ones, so a
  filter can always be widened again.
- **Column preferences** — a Columns menu per table, persisted per table id, so
  an analyst's nine columns and a dispatcher's four both survive a reload. The
  last visible column cannot be hidden; there would be no way back.
- **Select** — checkboxes with a real three-state header, feeding the bulk
  command bar.

Filters use *contains*, not equals: one filter state backs both controls, and a
value picked from the dropdown trivially contains itself.

## Responsive

The layout primitives live in `styles/global.css` — `.split`, `.auto-grid` and
their variants — because the pages were originally written with inline
`gridTemplateColumns`, and **an inline style cannot respond to a media query**.
Anything that reflows uses a class, so the breakpoints live in one place.

- Below 1100px, two-column pages stack.
- Below 900px the rail becomes an overlay with a scrim rather than taking a
  column of its own; 56px of icons beside a 320px page leaves nothing for the
  page. Labels show in the overlay, since it is full width.
- Below 720px control strips wrap, and the spacers that push buttons right are
  dropped — a spacer in a wrapped row strands the buttons on a line of their own.
- Tables never squash. They scroll inside their own container with a sticky
  header, which is the one place horizontal scrolling is correct.

Grid tracks use `minmax(min(240px, 100%), 1fr)`: without the `min()`, a
240px-minimum track refuses to shrink on a 320px phone and the whole page
scrolls sideways.


## Vehicle Tracking

The tracking screen had a map and a quick list but **no table**, which meant
leaving for the Vehicles page the moment you wanted to sort by charge. It now
has one below the map: sortable, a filter control under every heading it makes
sense on, column preferences, and the same four-format export menu as
everywhere else.

The map, the quick list and the table all read the same filtered result. The
table's own column filters narrow the *table* only — making them move the map
too would mean the "247 vehicles" tile and the pins stopped agreeing, which is
the kind of inconsistency an operator notices once and then stops trusting the
screen. There is also one search box, not two: the box above queries the API,
and the same term feeds the table so the filter dropdowns narrow with it.

Every operational table now carries the full treatment — vehicle tracking,
vehicles, batteries, users, riders, stations, maintenance, alarms, audit and
geofences. The only table without it is the three-row by-model summary on the
report, where sorting three rows is not a feature.
