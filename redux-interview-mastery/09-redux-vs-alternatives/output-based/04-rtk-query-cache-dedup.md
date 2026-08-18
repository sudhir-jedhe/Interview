## How many network requests fire when both components mount at the same time?

```jsx
function ProfileHeader({ userId }) {
  const { data } = useGetUserQuery(userId);
  return <span>{data?.name}</span>;
}

function ProfileSidebar({ userId }) {
  const { data } = useGetUserQuery(userId); // same userId, same endpoint, different component
  return <span>{data?.email}</span>;
}

function ProfilePage({ userId }) {
  return (
    <>
      <ProfileHeader userId={userId} />
      <ProfileSidebar userId={userId} />
    </>
  );
}
```

**Answer:** One network request, not two — even though `useGetUserQuery(userId)` is called independently in two different components with the same argument.

**Why:** RTK Query (and React Query, which behaves identically here) deduplicates requests by cache key, which is derived from the endpoint name plus its argument (`getUser` + `userId`). Both hooks resolve to the same cache key, so RTK Query recognizes the second call as "already have this data (or already fetching it)" and both components subscribe to the *same* underlying cache entry rather than triggering independent fetches. This is precisely the kind of behavior a hand-rolled thunk-based Redux slice does *not* give you for free — two components independently dispatching `fetchUser(userId)` on mount would fire two separate network requests unless you added manual in-flight-request tracking yourself. This deduplication-for-free is one of the concrete, checkable reasons "use RTK Query for server-cache data instead of hand-rolled Redux" is the correct recommendation, not just a stylistic preference.
