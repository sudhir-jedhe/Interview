// Runnable with plain Node: `node 06-decision-checklist-function.js`
// A lighthearted-but-genuinely-useful "which state solution" recommender.
// See problems/03-decision-checklist-tool.md for the full version with scoring rationale.

function recommendStateSolution({
  teamSize,               // number of engineers touching this codebase
  mostlyServerData,       // boolean: is most of this state a cache of server responses?
  needsTimeTravel,        // boolean: do you need action-replay debugging?
  complexAsyncFlows,      // boolean: multi-step, cancellable, race-condition-prone async logic?
  stateIsMostlyLocalUI,   // boolean: is this state scoped to one small feature/screen?
  manyIndependentFields,  // boolean: lots of fine-grained, independently-updating values (e.g. a big form)?
}) {
  if (mostlyServerData) {
    return 'RTK Query or React Query — this is cache management, not client state.';
  }
  if (stateIsMostlyLocalUI && teamSize <= 3) {
    return 'useState / useReducer (+ Context if you need to share it a couple levels down).';
  }
  if (manyIndependentFields && !needsTimeTravel) {
    return 'Jotai or Recoil — atomic model avoids re-render coordination for fine-grained state.';
  }
  if (teamSize <= 5 && !needsTimeTravel && !complexAsyncFlows) {
    return 'Zustand — minimal boilerplate, still centralizes state outside components.';
  }
  if (teamSize > 10 || needsTimeTravel || complexAsyncFlows) {
    return 'Redux (Toolkit) — you need enforced conventions, DevTools, and/or a mature async story.';
  }
  return 'Zustand or Redux Toolkit are both reasonable — let team familiarity decide.';
}

console.log(recommendStateSolution({ teamSize: 40, mostlyServerData: false, needsTimeTravel: true, complexAsyncFlows: true, stateIsMostlyLocalUI: false, manyIndependentFields: false }));
console.log(recommendStateSolution({ teamSize: 2, mostlyServerData: true, needsTimeTravel: false, complexAsyncFlows: false, stateIsMostlyLocalUI: false, manyIndependentFields: false }));
console.log(recommendStateSolution({ teamSize: 4, mostlyServerData: false, needsTimeTravel: false, complexAsyncFlows: false, stateIsMostlyLocalUI: false, manyIndependentFields: true }));
