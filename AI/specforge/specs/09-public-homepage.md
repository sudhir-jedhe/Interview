# Spec 09 — Public Homepage

## Goal

Build the public homepage for SpecForge.

This section should make the product look clear and polished without adding app feature pages.

## Current State Assumed

- Section 08 app layout and navbar are complete.
- Navbar already handles signed-in and signed-out states.
- `client/src/app/page.tsx` already exists from the Next.js starter.
- shadcn/ui is already installed with a theme.
- Theme tokens already exist in `client/src/app/globals.css`.
- Frontend should call the backend directly when linking to Google OAuth.

## Files Allowed to Change

- `client/src/app/page.tsx`

## Files Not Allowed to Change

- Backend files inside `server/`
- `client/src/app/layout.tsx`
- `client/src/components/navbar.tsx`
- Specs pages
- Dashboard page
- Notification components
- API helper files
- Shared types
- `client/src/app/globals.css`
- shadcn/ui generated files

## Page Route

```txt
/
```

## Page Purpose

Explain what SpecForge does and direct users to start with Google OAuth.

SpecForge positioning:

```txt
Turn rough feature ideas into structured technical specs using AI.
```

## Page Sections

Build these sections inside `client/src/app/page.tsx`.

### 1. Hero section

Content direction:

- Badge text: `AI Technical Spec Generator`
- Main headline: `Stop writing technical specs from scratch.`
- Supporting text: explain that SpecForge turns rough feature ideas into structured implementation specs for developers and teams.
- Primary CTA:
  - if keeping the page fully public: link to `${NEXT_PUBLIC_API_URL}/auth/google`
  - button text: `Generate your first spec`
- Secondary CTA:
  - link to `#how-it-works`
  - text: `See how it works`

Use a clean two-column desktop layout if it stays readable.

Left side: headline and CTA.

Right side: a product preview card showing sample generated spec sections.

### 2. Problem cards

Add 3 cards:

- `Manual specs take hours`
- `Scope gets unclear`
- `Handoffs become messy`

Each card should have a short 1–2 sentence explanation.

Desktop layout:

- 3 columns

Mobile layout:

- 1 column

### 3. How it works

Add section id:

```txt
how-it-works
```

Add 3 cards:

1. `Describe the feature`
2. `AI generates the structure`
3. `Use the spec to build`

Each card should have a short explanation.

Desktop layout:

- 3 columns

Mobile layout:

- 1 column

### 4. Final CTA

Add a simple bottom callout card.

Content direction:

- title: `Ready to plan your next feature faster?`
- text: one short sentence
- CTA button linking to Google OAuth

## Styling Rules

Use theme tokens only.

Preferred classes:

- `bg-background`
- `bg-card`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`
- `bg-muted`

Do not use random color classes like:

- `bg-blue-600`
- `text-slate-500`
- `bg-zinc-900`
- `text-purple-500`

Layout guidance:

- page container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- major sections: `py-16` or similar
- cards: `rounded-2xl border border-border bg-card p-6`
- buttons: use primary style for main CTA and outline/secondary style for less important actions

Keep the page visually strong but not overcomplicated.

## Implementation Notes

- Do not add a separate component file in this section.
- Keep static arrays inside `page.tsx` for cards.
- Use `process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"` for the Google OAuth URL.
- Do not add client-side state.
- Do not add animations.
- Do not add external images.
- Do not add charts.

## Verification

Run from `client/`:

```bash
npm run dev
```

Expected:

- Homepage builds successfully.
- Navbar still appears from the shared layout.
- Homepage uses theme tokens from the installed shadcn theme.
- No backend files are changed.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 09 as completed.
- Set next section to Section 10 — Specs List Page and Polling.
- Keep notes short.
