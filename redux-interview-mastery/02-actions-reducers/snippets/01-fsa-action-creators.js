// Flux Standard Action-shaped action creators, hand-written.
// Run with: node 01-fsa-action-creators.js
function itemAdded(item) {
  return { type: 'cart/itemAdded', payload: item };
}

function itemRemoved(id) {
  return { type: 'cart/itemRemoved', payload: id };
}

function fetchFailed(error) {
  return { type: 'cart/fetchFailed', payload: error, error: true };
}

console.log(itemAdded({ id: 1, name: 'Book' }));
// -> { type: 'cart/itemAdded', payload: { id: 1, name: 'Book' } }

console.log(itemRemoved(1));
// -> { type: 'cart/itemRemoved', payload: 1 }

console.log(fetchFailed(new Error('Network timeout')));
// -> { type: 'cart/fetchFailed', payload: Error(...), error: true }

module.exports = { itemAdded, itemRemoved, fetchFailed };
