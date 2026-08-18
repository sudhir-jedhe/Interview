// Manual immutable updates get unwieldy fast for nested state — shown here
// without Immer, to make the pain (and the value createSlice adds) concrete.
// Run with: node 05-immutable-nested-update.js
const { createStore } = require('redux');

const initialState = {
  user: {
    profile: { name: 'Ada', address: { city: 'London', zip: '00000' } },
  },
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'user/cityChanged':
      return {
        ...state,
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            address: {
              ...state.user.profile.address,
              city: action.payload,
            },
          },
        },
      };
    default:
      return state;
  }
}

const store = createStore(userReducer);
store.dispatch({ type: 'user/cityChanged', payload: 'Berlin' });
console.log(store.getState().user.profile.address.city); // 'Berlin'
// Compare to the createSlice equivalent, which would just be:
//   state.user.profile.address.city = action.payload;
