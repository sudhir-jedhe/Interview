## After `createUser` succeeds, does the users list on screen update? Why or why not?

```javascript
// Hand-rolled Redux, no RTK Query
const usersSlice = createSlice({
  name: 'users',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => { state.data = action.payload; })
      .addCase(createUser.fulfilled, (state, action) => {
        // NOTE: createUser's thunk resolves with the created user, but this
        // reducer doesn't add it to state.data or trigger a refetch.
      });
  },
});

// Component:
function UsersPage() {
  const users = useSelector((state) => state.users.data);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(fetchUsers()); }, []); // only fetches once, on mount

  const handleCreate = async (newUser) => {
    await dispatch(createUser(newUser));
    // no dispatch(fetchUsers()) here either
  };

  return <UserList users={users} onCreate={handleCreate} />;
}
```

**Answer:** No — after `createUser` succeeds, the on-screen list does not include the new user. `state.users.data` is unchanged, because nothing in `createUser.fulfilled`'s reducer case updates it, and nothing re-triggers `fetchUsers`.

**Why:** This is the "server-cache data in hand-rolled Redux" anti-pattern's most common symptom: the fetch-side (`fetchUsers`) and the mutation-side (`createUser`) are two independent pieces of hand-written logic with no structural link between them — nothing enforces that a successful mutation invalidates or updates the relevant cached query data, so it's easy (as here) to simply forget the wiring. The immediate hand-rolled fix would be adding `state.data.push(action.payload)` inside `createUser.fulfilled`, but that only fixes *this* component's list — any other component with its own independently-fetched copy of user data (e.g., a dropdown elsewhere showing assignable users) would still be stale, because there's no shared cache-invalidation concept, just scattered, ad-hoc reducer patches. This is exactly the class of problem RTK Query's `invalidatesTags`/`providesTags` solves structurally: declare once that `createUser` invalidates the `User` list tag, and every `useGetUsersQuery()` call anywhere in the app — not just this one slice's hand-maintained array — automatically refetches.
