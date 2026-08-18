# Problem 3: Build a Decision Checklist for "Which State Solution?"

## Task

Write a function (or a table-as-code) that takes a small set of app/team characteristics and outputs a recommended state-management approach, with a one-line justification for each branch. This should be genuinely usable — something you could actually run against a real app's characteristics — not just a flowchart image description.

## Solution

```javascript
/**
 * Recommends a state-management approach given app/team characteristics.
 * Order of checks matters: more specific/urgent signals are checked first.
 */
function recommendStateSolution(input) {
  const {
    teamSize,
    mostlyServerData,
    needsTimeTravelDebugging,
    complexAsyncFlows,
    manyIndependentFineGrainedFields,
    alreadyHasLargeReduxCodebase,
  } = input;

  const recommendations = [];

  // Server-cache data is a separate axis from client-state choice — always call it out.
  if (mostlyServerData) {
    recommendations.push({
      concern: 'server-derived data (fetched from an API)',
      tool: 'RTK Query or React Query',
      why: 'Caching, dedup, invalidation, and refetch-on-focus come built in — hand-rolled Redux reducers reimplement this poorly.',
    });
  }

  // Client-state axis:
  if (alreadyHasLargeReduxCodebase) {
    recommendations.push({
      concern: 'client state (existing codebase)',
      tool: 'Redux (Toolkit)',
      why: 'Migration cost of leaving an established, working Redux codebase usually exceeds the benefit of a newer library, absent a specific unsolved pain point.',
    });
  } else if (needsTimeTravelDebugging || complexAsyncFlows || teamSize > 10) {
    recommendations.push({
      concern: 'client state (new/small codebase)',
      tool: 'Redux (Toolkit)',
      why: `Triggered by: ${[
        needsTimeTravelDebugging && 'time-travel debugging need',
        complexAsyncFlows && 'complex async orchestration',
        teamSize > 10 && 'large team needing enforced conventions',
      ].filter(Boolean).join(', ')}.`,
    });
  } else if (manyIndependentFineGrainedFields) {
    recommendations.push({
      concern: 'client state (new/small codebase)',
      tool: 'Jotai (or Recoil)',
      why: 'Atomic model gives per-field subscription granularity without hand-written selector scoping for every field.',
    });
  } else if (teamSize <= 5) {
    recommendations.push({
      concern: 'client state (new/small codebase)',
      tool: 'Zustand, or useState/Context for small scopes',
      why: 'Small team, no enforced-convention need yet — minimize ceremony and ship faster.',
    });
  } else {
    recommendations.push({
      concern: 'client state (new/small codebase)',
      tool: 'Zustand or Redux Toolkit',
      why: 'Borderline case — let existing team familiarity and future growth plans decide.',
    });
  }

  return recommendations;
}

// Example: a mid-size team building a dashboard with live data and no complex async
console.log(recommendStateSolution({
  teamSize: 8,
  mostlyServerData: true,
  needsTimeTravelDebugging: false,
  complexAsyncFlows: false,
  manyIndependentFineGrainedFields: false,
  alreadyHasLargeReduxCodebase: false,
}));
// => [
//   { concern: 'server-derived data...', tool: 'RTK Query or React Query', why: '...' },
//   { concern: 'client state...', tool: 'Zustand or Redux Toolkit', why: 'Borderline case...' },
// ]
```

## Why this is genuinely useful, not just a toy

It forces the two-axis framing from `interview-qa/03-choosing-the-right-tool.md` — server-cache and client-state are answered independently, which is exactly the mistake most "Redux vs X" hot takes skip past by treating "state management" as one undifferentiated blob. Running this against a real app's characteristics (or walking through it verbally in an interview) demonstrates the decision is criteria-driven, not vibes-driven — and the `why` string for each branch is exactly the kind of one-sentence justification that holds up under a follow-up "why though?" question.
