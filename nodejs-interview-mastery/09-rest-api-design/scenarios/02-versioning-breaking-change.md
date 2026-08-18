# Scenario: Changing a Resource Shape Without Breaking Existing Mobile Clients

A mobile app team needs to change the shape of `/users/:id` without breaking the current app in production. You want to rename `full_name` to `name` and nest `address` fields, but thousands of installed app instances still call the old shape and can't be force-updated immediately.

**Approach:**
Introduce URL-based versioning rather than mutating the existing endpoint in place. Keep `/v1/users/:id` serving the old shape untouched, and stand up `/v2/users/:id` with the new shape. New app builds point at `/v2`; old installs keep working against `/v1` until you've observed traffic to `/v1` drop to near zero (via access logs), at which point you deprecate it with a sunset header and eventually remove it.

```js
const v1 = express.Router();
const v2 = express.Router();

v1.get('/users/:id', async (req, res) => {
  const u = await getUser(req.params.id);
  res.json({ full_name: u.name, email: u.email });
});

v2.get('/users/:id', async (req, res) => {
  const u = await getUser(req.params.id);
  res.json({ data: { name: u.name, email: u.email, address: u.address } });
});

app.use('/v1', v1);
app.use('/v2', v2);

// on the still-supported old version, warn clients it's going away:
v1.use((req, res, next) => {
  res.set('Sunset', 'Sat, 31 Jan 2027 00:00:00 GMT');
  next();
});
```
