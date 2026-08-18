# Output: What does `this.props.itemAdded(x)` actually do with the object shorthand?

```jsx
import { itemAdded } from './cartSlice'; // action creator: (item) => ({ type: 'cart/itemAdded', payload: item })

class AddButton extends React.Component {
  handleClick = () => {
    const result = this.props.itemAdded({ id: 1, name: 'Book' });
    console.log('itemAdded call returned:', result);
  };
  render() {
    return <button onClick={this.handleClick}>Add</button>;
  }
}

// Object shorthand form of mapDispatchToProps:
export default connect(null, { itemAdded })(AddButton);
```

**Answer:** `console.log` prints `itemAdded call returned: { type: 'cart/itemAdded', payload: { id: 1, name: 'Book' } }` — i.e., the *action object*, not `undefined` and not whatever `dispatch` itself returns by default for a plain action (which, in plain Redux, is actually the same action object — so this happens to match either way, but the key insight is about what's being called).

**Why:** With the object shorthand, `connect` doesn't just attach the raw action creator as a prop — it wraps every function in the object with `(...args) => dispatch(actionCreator(...args))` (technically, via `bindActionCreators` internally). So `this.props.itemAdded(x)` is really calling `dispatch(itemAdded(x))` under the hood, and its return value is whatever `dispatch` returns for that call — for a plain synchronous action (as in this example), that's the action object itself, matching plain Redux's default `dispatch` return behavior. This shorthand is convenient specifically because it means components never need to import `dispatch` at all when using `connect`'s object form — every action creator passed in `mapDispatchToProps`'s object becomes a ready-to-call, pre-bound prop.
