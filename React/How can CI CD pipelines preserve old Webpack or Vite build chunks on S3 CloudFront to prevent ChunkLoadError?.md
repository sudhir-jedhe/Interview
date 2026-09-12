To eliminate `ChunkLoadError` during deployments, the CI/CD pipeline must treat static chunks as **immutable, cumulative artifacts** rather than replacing the storage bucket wholesale on every release.

When a user is actively browsing an app during a deployment, their client still requests chunks from the previous build manifest. If the pipeline deletes those old chunks or runs `aws s3 sync --delete` on everything, any lazy-loaded route (`React.lazy()`) or dynamic import requested by that user immediately crashes.

---

### The Two-Stage Deployment Strategy

The deployment pipeline must separate the release into two phases:

1. **Upload new hashed chunks first** (without deleting old chunks).
2. **Deploy the unhashed entry point (`index.html`) last**, followed by an invalidation of `index.html` at the CDN edge.

```
[Build Artifacts]
       │
       ├── 1. Sync /assets/ (NO --delete)  ──► Old chunks remain untouched
       │                                       New chunks are available immediately
       │
       ├── 2. Upload index.html             ──► New sessions get new bundle manifest
       │
       └── 3. Invalidate CDN (/index.html) ──► Edge immediately routes to new HTML

```

---

### Implementation: GitHub Actions + AWS S3/CloudFront

This production-tested GitHub Actions workflow implements non-destructive chunk deployment with separate cache headers:

```yaml
name: Deploy Single Page App

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build # Outputs to dist/

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      # ----------------------------------------------------------------------
      # STEP 1: Upload Hashed Assets (NEVER use --delete here)
      # Sets long-term immutable caching. Old chunks persist alongside new ones.
      # ----------------------------------------------------------------------
      - name: Sync Immutable Chunks
        run: |
          aws s3 sync dist/assets/ s3://${{ secrets.S3_BUCKET_NAME }}/assets/ \
            --cache-control "public, max-age=31536000, immutable"

      # ----------------------------------------------------------------------
      # STEP 2: Upload Non-Hashed Files (index.html, robots.txt, manifest.json)
      # Sets no-cache so browsers always check CloudFront for the newest HTML.
      # ----------------------------------------------------------------------
      - name: Upload Entry Points
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }}/ \
            --exclude "assets/*" \
            --cache-control "no-cache, no-store, must-revalidate"

      # ----------------------------------------------------------------------
      # STEP 3: Invalidate ONLY index.html at CloudFront Edge
      # DO NOT invalidate /* — invalidating chunks wastes money and ruins cache hit ratio.
      # ----------------------------------------------------------------------
      - name: Invalidate CloudFront HTML
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} \
            --paths "/index.html" "/"

```

---

### Managing Bucket Bloat: S3 Lifecycle Rules

Because chunks are never deleted during deployment, the bucket will grow indefinitely over time. **Never clean old chunks in the CI/CD pipeline itself.** If you delete files during CI, a user who opened the app 10 minutes ago will still hit errors.

Instead, let **AWS S3 Lifecycle Rules** prune assets automatically based on age:

1. Open **AWS S3 Console** $\to$ Your Bucket $\to$ **Management** $\to$ **Lifecycle Rules**.
2. Create a rule: `Expire-Old-Hashed-Assets`.
3. Filter by prefix: `assets/` (or wherever Webpack/Vite emits chunks).
4. Action: **Expire current versions of objects**.
5. Set retention window: **30 to 90 days**.

* **Why 30–90 days?**
* It guarantees that even users who leave dashboard tabs open for days or weeks will never experience a `ChunkLoadError` when navigating between routes.
* Any chunk that is genuinely obsolete will be cleaned up safely in the background by AWS without touching active user traffic.

---

### CloudFront Distribution Best Practices

To ensure CloudFront supports this architecture without stale caching conflicts:

* **Managed Cache Policies**:
* Attach **`CachingOptimized`** to the default behavior for `/assets/*`. Since the files have unique content hashes, CloudFront can cache them at the edge for a year.
* Create a custom cache behavior for `/index.html` with minimum, default, and maximum TTL set to `0` (or configure CloudFront to respect the origin's `no-cache` header via **`UseOriginCacheControlHeaders`**).

* **Targeted Invalidations**:
* Always limit invalidation paths to `["/index.html", "/"]`.
* Running wildcard invalidations (`/*`) forces CloudFront to purge all cached JS and CSS from all edge servers globally, creating massive origin traffic spikes back to your S3 bucket on every release.
