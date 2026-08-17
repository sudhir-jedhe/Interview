**Problem:** A test passes immediately, but the assertion never actually ran.
**Solution:** You forgot the `await` keyword before `expect(locator)`. Because web-first assertions return Promises, omitting `await` causes the runner to exit before the assertion completes.
