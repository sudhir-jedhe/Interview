**Problem:** You used `page.route('**/*', route => { ... })` and now the page never finishes loading.
**Solution:** You forgot to call `route.continue()` for requests you did not want to mock. Always call `route.fallback()` or `route.continue()` if your route logic does not match the request.
