Scenario 1:
You trigger 5 parallel API calls using Promise.all.
Two of them reject immediately.
Three are still running.
Question:
Will the remaining 3 promises stop executing?
Answer:
No.
Promise.all fails fast in terms of result, but it does NOT cancel the other promises. JavaScript has no built-in cancellation mechanism. The remaining promises continue running in the background.
Interview follow-up:
So how would you actually cancel them?
Correct direction:
AbortController (for fetch) or a custom cancellation pattern. Promise.all does not give you control over cancellation.

Scenario 2:
You use Promise.any with 4 APIs.
All of them fail.
Question:
What does it throw?
Answer:
It throws an AggregateError, not a normal Error.
And inside it, you get an errors array containing all rejection reasons.
Many experienced developers miss this.

Scenario 3:
You use Promise.race for request timeout handling.
Example logic:
Race between API call and a timeout promise.
Question:
What happens if the API resolves after timeout already rejected?
Answer:
The API promise still resolves later.
Race only determines which result you get first.
It does not stop the slower promise.
This creates hidden memory leaks if you don’t abort the request.

Scenario 4:
You want:
Return first successful API.
But if all fail, show a combined error report.
Which method?
Correct answer:
Promise.any.
But here’s the catch:
If your environment doesn’t support it (older Node versions), you need a polyfill or custom implementation.

Tip:
Promise.all → Fail fast
Promise.allSettled → Never fail
Promise.race → First settled wins
Promise.any → First success wins

But none of them cancel anything.
