// Legacy connect(mapStateToProps, mapDispatchToProps) usage with a class
// component — still common in older codebases.
import React from 'react';
import { connect } from 'react-redux';
import { itemRemoved } from './cartSlice';

class CartBadge extends React.Component {
  render() {
    const { itemCount, clearCart } = this.props;
    return (
      <div>
        <span className="badge">{itemCount}</span>
        <button onClick={clearCart}>Clear cart</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  itemCount: state.cart.items.length,
});

const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch({ type: 'cart/cleared' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartBadge);
