# Scenario: Migrating `connect`-based class components to hooks during an active feature freeze

**Problem:** Leadership wants the codebase modernized to hooks (partly to unblock adopting React features that require function components, like Suspense-based data fetching down the line), but the team is in a feature freeze — no risky, large-diff refactors allowed until after the freeze ends. There are ~15 `connect`-based class components.

**Approach:**
1. Reframe the migration as low-risk specifically because `connect` and `useSelector`/`useDispatch` are runtime-compatible siblings, not competing systems — both ultimately read from the same store via the same underlying Context, so migrating one component doesn't require touching its siblings, its parent, or the store setup at all.
2. Prioritize by risk and value: migrate the smallest, most isolated, least business-critical `connect`-based components first (e.g., a static "footer" component using `connect` only to read a `theme` flag) to validate the team's migration process and testing coverage, before touching anything complex or revenue-critical, respecting the spirit of the feature freeze (small, well-tested, behavior-preserving diffs) even if it's not a "feature."
3. For each component, follow a mechanical, low-risk conversion pattern: convert the class to a function component, replace `mapStateToProps`'s fields with individual `useSelector` calls (narrower than the original combined object, per `theory/05-avoiding-unnecessary-rerenders.md` — a nice side benefit, not the main goal), replace `mapDispatchToProps`/`this.props.dispatch` usage with `useDispatch()`, and replace lifecycle methods with `useEffect` only where the class actually needs one (some `connect`ed classes have no lifecycle methods at all beyond `render`, making them trivial one-for-one conversions).
   ```jsx
   // Before
   class Footer extends React.Component {
     render() { return <footer className={this.props.theme}>...</footer>; }
   }
   export default connect((state) => ({ theme: state.ui.theme }))(Footer);

   // After
   function Footer() {
     const theme = useSelector((state) => state.ui.theme);
     return <footer className={theme}>...</footer>;
   }
   export default Footer;
   ```
4. Explicitly exclude any class component from this pass that relies on features hooks don't cover (error boundaries via `componentDidCatch`/`getDerivedStateFromError`) — those stay as `connect`-based classes, which is fine, since `connect` isn't deprecated and both patterns are supported indefinitely by `react-redux`.
5. Land each conversion as its own small, individually reviewable PR with before/after screenshots or a passing existing test suite as evidence of behavior-preservation — this keeps each change auditable and revertible independently, which is exactly the kind of low-risk incremental change a feature freeze is meant to still allow.

The interview-relevant point: knowing that `connect` and hooks are two client APIs over the *same* underlying store/Context mechanism (not two different data-flow systems) is precisely what makes this kind of incremental, low-risk migration possible — you're changing how a component talks to Redux, not what Redux itself is doing.
