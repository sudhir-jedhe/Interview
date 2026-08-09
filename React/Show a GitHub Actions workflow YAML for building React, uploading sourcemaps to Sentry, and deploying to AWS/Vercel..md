Here are complete, production-ready GitHub Actions workflows for both deployment targets (**Vercel** and **AWS S3/CloudFront**).

Both workflows follow the security rule: **generate sourcemaps $\rightarrow$ upload to Sentry $\rightarrow$ strip `.map` files $\rightarrow$ deploy clean assets**.

---

### Key Workflow Architecture

```text
┌────────────────────────────────────────────────────────┐
│ 1. Checkout & Node Setup (Cache dependencies)          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Build React App (Generates JS + .map files)         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Upload Sourcemaps to Sentry (via Sentry CLI)        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. Delete Local `.map` Files                           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 5. Deploy Clean Build Artifacts (Vercel / AWS S3)      │
└────────────────────────────────────────────────────────┘

```

---

### Option A: Deployment to Vercel

Save this file as `.github/workflows/deploy-vercel.yml`:

```yaml
name: Build, Sentry Sourcemaps & Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Create Release ID
        id: release_id
        run: echo "SENTRY_RELEASE=${GITHUB_SHA}" >> $GITHUB_ENV

      # Step 1: Build React App (Configured to generate sourcemaps)
      - name: Build React App
        env:
          REACT_APP_SENTRY_RELEASE: ${{ env.SENTRY_RELEASE }}
          GENERATE_SOURCEMAP: 'true' # For Create React App / standard Webpack
        run: npm run build

      # Step 2: Upload Sourcemaps to Sentry
      - name: Create Sentry Release & Upload Sourcemaps
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
        with:
          version: ${{ env.SENTRY_RELEASE }}
          sourcemaps: './build' # Path to build output (or './dist' for Vite/Webpack)

      # Step 3: Remove .map files so they are NOT uploaded to Vercel
      - name: Clean up sourcemaps before deployment
        run: |
          find ./build -name "*.map" -type f -delete
          echo "All .map files removed from build artifacts."

      # Step 4: Deploy Clean Build to Vercel
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

```

---

### Option B: Deployment to AWS (S3 + CloudFront Invalidation)

Save this file as `.github/workflows/deploy-aws.yml`:

```yaml
name: Build, Sentry Sourcemaps & Deploy to AWS S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Create Release ID
        id: release_id
        run: echo "SENTRY_RELEASE=${GITHUB_SHA}" >> $GITHUB_ENV

      # Step 1: Build React App
      - name: Build React App
        env:
          REACT_APP_SENTRY_RELEASE: ${{ env.SENTRY_RELEASE }}
          GENERATE_SOURCEMAP: 'true'
        run: npm run build

      # Step 2: Upload Sourcemaps to Sentry
      - name: Create Sentry Release & Upload Sourcemaps
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
        with:
          version: ${{ env.SENTRY_RELEASE }}
          sourcemaps: './dist' # Use './build' if using Create React App

      # Step 3: Strip .map files locally
      - name: Clean up sourcemaps before deployment
        run: |
          find ./dist -name "*.map" -type f -delete
          echo "All .map files deleted."

      # Step 4: Configure AWS Credentials
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      # Step 5: Sync Clean Artifacts to S3 Bucket
      - name: Sync to S3
        run: |
          aws s3 sync ./dist s3://${{ secrets.AWS_S3_BUCKET }} --delete

      # Step 6: Invalidate CloudFront Cache
      - name: Invalidate CloudFront Cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

```

---

### Required GitHub Repository Secrets

Configure the following secrets in your repository (**Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions**):

| Secret Name                  | Description                                                | Required For |
| ---------------------------- | ---------------------------------------------------------- | ------------ |
| `SENTRY_AUTH_TOKEN`          | Sentry Organization Auth Token (`project:releases` scope)  | Both         |
| `SENTRY_ORG`                 | Your Sentry organization slug                              | Both         |
| `SENTRY_PROJECT`             | Your Sentry project slug                                   | Both         |
| `VERCEL_TOKEN`               | Access Token generated in Vercel Account Settings          | Vercel       |
| `VERCEL_ORG_ID`              | Organization ID (found in `.vercel/project.json`)          | Vercel       |
| `VERCEL_PROJECT_ID`          | Project ID (found in `.vercel/project.json`)               | Vercel       |
| `AWS_ACCESS_KEY_ID`          | AWS IAM User Access Key                                    | AWS          |
| `AWS_SECRET_ACCESS_KEY`      | AWS IAM User Secret Key                                    | AWS          |
| `AWS_S3_BUCKET`              | Target S3 Bucket name (e.g., `my-react-app-prod`)          | AWS          |
| `CLOUDFRONT_DISTRIBUTION_ID` | Target CloudFront Distribution ID (e.g., `E103XXXXXXXXXX`) | AWS          |
