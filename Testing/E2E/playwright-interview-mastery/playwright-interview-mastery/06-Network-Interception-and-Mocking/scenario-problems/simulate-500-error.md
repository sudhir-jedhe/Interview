**Scenario:** Verifying that the application displays a user-friendly error banner when the backend returns a 500 error.
**Implementation:** Intercept the API call and use `route.fulfill({ status: 500 })`, then assert that the red error banner becomes visible in the DOM.
