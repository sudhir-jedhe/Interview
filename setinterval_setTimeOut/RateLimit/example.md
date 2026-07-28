I'll create a React component to demonstrate the Token Bucket Algorithm for rate limiting. This will provide an interactive way to understand how the rate limiter works.

```typescriptreact project="TokenBucketRateLimiter"
...
```

This implementation demonstrates the Token Bucket Algorithm for rate limiting in an interactive React component. Here's a breakdown of the key aspects:

1. **RateLimiter Class**:

1. Implements the Token Bucket Algorithm.
1. Manages tokens, refills them at a specified rate, and allows or blocks requests based on token availability.

1. **React Component (TokenBucketDemo)**:

1. Provides an interface to interact with the RateLimiter.
1. Allows users to set the capacity, refill rate, and interval.
1. Visualizes the current number of tokens in the bucket.
1. Provides a button to simulate making requests.
1. Displays a log of allowed and blocked requests.

1. **State Management**:

1. Uses `useState` for managing the RateLimiter instance, configuration parameters, and logs.
1. Uses `useEffect` to create and update the RateLimiter instance when configuration changes.
1. Uses another `useEffect` to update the token count display in real-time.

1. **User Interface**:

1. Input fields for setting capacity, refill rate, and interval.
1. Visual representation of the token bucket's current state.
1. "Make Request" button to simulate requests.
1. Log display for request outcomes.

1. **Styling**:

1. Uses shadcn/ui components (`Button`, `Input`, `Card`) for consistent styling.
1. Implements a progress bar to visualize the token bucket's fullness.

This implementation provides an interactive way to understand and experiment with the Token Bucket Algorithm for rate limiting. Users can adjust the parameters in real-time and see how they affect the rate limiter's behavior. The visual representation of the token bucket and the log of requests help in understanding how the algorithm works in practice.

The component also handles cleanup by stopping the refill timer when unmounting, preventing memory leaks.
