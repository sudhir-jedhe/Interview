**The Short Rule:**

* Use **`createApi` (RTK Query)** when you are managing **server state**—fetching, caching, polling, or synchronizing data with a backend API (REST or GraphQL).
* Use **`createAsyncThunk`** when you need **custom async business logic**—such as reading/writing to device storage (IndexedDB, AsyncStorage), interacting with browser APIs (Web Workers, Geolocation), multi-step client transformations, or orchestrating actions across multiple unrelated slices.
