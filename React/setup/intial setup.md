Setting up a React project from scratch can mean two things depending on your goal:

1. **Modern Production / App Setup (Recommended):** Using **Vite**, which gives you a lightning-fast build setup, pre-configured JSX/TSX support, and Hot Module Replacement (HMR).
2. **True Low-Level Setup (For Learning):** Building a project from total scratch using **Webpack** and **Babel** manually to understand how React, transpilation, and bundling fit together under the hood.

Here are step-by-step guides for both approaches.

---

## Approach 1: Modern & Fast Setup using Vite (Recommended)

This is the standard modern setup used in production today, replacing legacy tooling like Create React App.

1. **Initialize Project:** Prerequisites: Node.js (v18+) installed.
Open your terminal, navigate to your workspace directory, and run the Vite scaffolding command:

```bash
npm create vite@latest my-react-app -- --template react

```

*(If you want TypeScript support, use `-- --template react-ts` instead).*

1. **Install Dependencies:** Navigate to folder and install packages.
Move into the project folder and install the initial NPM packages:

```bash
cd my-react-app
npm install

```

1. **Start Development Server:** Runs on <http://localhost:5173>.
Launch the hot-reloading development server:

```bash
npm run dev

```

---

## Approach 2: Manual Setup with Webpack 5 & Babel (From Complete Scratch)

If you want to understand how bundling works from the ground up without any scaffolding CLI, follow this manual step-by-step build.

### 1. Initialize Directory & Package Manager

Create a new directory and initialize `package.json`:

```bash
mkdir react-from-scratch
cd react-from-scratch
npm init -y

```

---

### 2. Install React Dependencies

Install React and the React DOM rendering engine:

```bash
npm install react react-dom

```

---

### 3. Install Webpack, Babel, and Loaders

Install the build tooling as development dependencies:

```bash
npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin
npm install -D @babel/core babel-loader @babel/preset-env @babel/preset-react
npm install -D style-loader css-loader

```

* **Webpack:** Module bundler that packages all JS, CSS, and assets into a single bundle.
* **Babel:** Transpiles modern JavaScript and React JSX syntax into backward-compatible ES5 code.
* **Loaders:** Allow Webpack to process non-JS files (`css-loader`, `babel-loader`).

---

### 4. Configure Babel (`.babelrc`)

Create a file named `.babelrc` in the root folder to tell Babel which presets to use:

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}

```

---

### 5. Configure Webpack (`webpack.config.js`)

Create a `webpack.config.js` file in the root directory:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true, // Cleans dist folder on each build
  },
  mode: 'development',
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true, // Supports React Router client-side routing
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

```

---

### 6. Create Source Files

Create the required folder structure and files:

```bash
mkdir public src

```

#### `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React From Scratch</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>

```

#### `src/App.jsx`

```javascript
export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>React App Built From Scratch! 🚀</h1>
      <p>Configured manually using Webpack 5 and Babel.</p>
    </div>
  );
}

```

#### `src/index.js`

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

### 7. Add Scripts to `package.json`

Add build and development scripts inside your `package.json`:

```json
"scripts": {
  "start": "webpack serve",
  "build": "webpack"
}

```

---

### 8. Run the Application

Start the development server:

```bash
npm start

```

Your app will launch automatically at `http://localhost:3000`.

To create an optimized production bundle in the `dist/` directory:

```bash
npm run build

```

Show me how to add TypeScript configuration to a React project setup.

Adding TypeScript to a React project ensures compile-time type safety, better IDE autocompletion, and refactoring confidence.

Here are step-by-step guides for adding TypeScript to both a **Vite** setup and a **manual Webpack 5 + Babel** setup.

---

## Method 1: Vite + React + TypeScript (Recommended)

If you are using Vite, you can either create a new TypeScript project or migrate an existing JS project.

### Option A: Scaffold a New Vite TypeScript Project

Run the following command in your terminal:

```bash
npm create vite@latest my-react-ts-app -- --template react-ts
cd my-react-ts-app
npm install
npm run dev

```

### Option B: Add TypeScript to an Existing JavaScript Vite Project

1. **Install TypeScript Packages:** Install TypeScript and React Type Definitions.
Install TypeScript and type definitions for React as dev dependencies:

```bash
npm install -D typescript @types/react @types/react-dom

```

1. **Create tsconfig.json:** Generate base compiler configuration.
Initialize a `tsconfig.json` file in the root of your project:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting / Strictness */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

```

1. **Rename Source Files:** Rename src/main.jsx to main.tsx and update index.html.
1. Rename `src/main.jsx` to `src/main.tsx`.
1. Rename your component files from `.jsx` to `.tsx` (e.g., `App.jsx` $\rightarrow$ `App.tsx`).
1. In `index.html`, update the script tag entry point:

```html
<script type="module" src="/src/main.tsx"></script>

```

---

## Method 2: Manual Webpack 5 + Babel + TypeScript Setup

If you are building your React setup manually using Webpack, follow these steps to add TypeScript compilation.

### Step 1: Install TypeScript Dependencies

Install TypeScript, `@babel/preset-typescript`, and React type definitions:

```bash
npm install -D typescript @types/react @types/react-dom @babel/preset-typescript

```

---

### Step 2: Configure `tsconfig.json`

Create a `tsconfig.json` in the root directory:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "jsx": "react-jsx",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}

```

---

### Step 3: Update `.babelrc`

Add `@babel/preset-typescript` to your Babel presets array:

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }],
    "@babel/preset-typescript"
  ]
}

```

---

### Step 4: Update `webpack.config.js`

Update the test regex to support `.ts` and `.tsx` extensions, and update the `resolve.extensions` array:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Updated entry file to TSX
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  mode: 'development',
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/, // Updated regex for .ts and .tsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // Added .tsx and .ts
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

```

---

### Step 5: Write Typed React Components

Create or rename your components with typed props.

#### `src/App.tsx`

```tsx
interface AppProps {
  title?: string;
}

export default function App({ title = 'React + TypeScript' }: AppProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>{title} Project Setup 🚀</h1>
      <p>Configured cleanly with compile-time type safety.</p>
    </div>
  );
}

```

#### `src/index.tsx`

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

### Step 6: Add Type-Checking Script to `package.json`

Because Babel transpiles TypeScript without type-checking, add a dedicated type-check script to your `package.json` using the TypeScript compiler (`tsc`):

```json
"scripts": {
  "start": "webpack serve",
  "build": "tsc --noEmit && webpack",
  "type-check": "tsc --noEmit"
}

```

Running `npm run type-check` will validate all types across your project before running production builds.

Adding TypeScript to a React project ensures compile-time type safety, better IDE autocompletion, and refactoring confidence.

Here are step-by-step guides for adding TypeScript to both a **Vite** setup and a **manual Webpack 5 + Babel** setup.

---

## Method 1: Vite + React + TypeScript (Recommended)

If you are using Vite, you can either create a new TypeScript project or migrate an existing JS project.

### Option A: Scaffold a New Vite TypeScript Project

Run the following command in your terminal:

```bash
npm create vite@latest my-react-ts-app -- --template react-ts
cd my-react-ts-app
npm install
npm run dev

```

### Option B: Add TypeScript to an Existing JavaScript Vite Project

1. **Install TypeScript Packages:** Install TypeScript and React Type Definitions.
Install TypeScript and type definitions for React as dev dependencies:

```bash
npm install -D typescript @types/react @types/react-dom

```

1. **Create tsconfig.json:** Generate base compiler configuration.
Initialize a `tsconfig.json` file in the root of your project:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting / Strictness */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

```

1. **Rename Source Files:** Rename src/main.jsx to main.tsx and update index.html.
1. Rename `src/main.jsx` to `src/main.tsx`.
1. Rename your component files from `.jsx` to `.tsx` (e.g., `App.jsx` $\rightarrow$ `App.tsx`).
1. In `index.html`, update the script tag entry point:

```html
<script type="module" src="/src/main.tsx"></script>

```

---

## Method 2: Manual Webpack 5 + Babel + TypeScript Setup

If you are building your React setup manually using Webpack, follow these steps to add TypeScript compilation.

### Step 1: Install TypeScript Dependencies

Install TypeScript, `@babel/preset-typescript`, and React type definitions:

```bash
npm install -D typescript @types/react @types/react-dom @babel/preset-typescript

```

---

### Step 2: Configure `tsconfig.json`

Create a `tsconfig.json` in the root directory:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "jsx": "react-jsx",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}

```

---

### Step 3: Update `.babelrc`

Add `@babel/preset-typescript` to your Babel presets array:

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }],
    "@babel/preset-typescript"
  ]
}

```

---

### Step 4: Update `webpack.config.js`

Update the test regex to support `.ts` and `.tsx` extensions, and update the `resolve.extensions` array:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Updated entry file to TSX
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  mode: 'development',
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/, // Updated regex for .ts and .tsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // Added .tsx and .ts
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

```

---

### Step 5: Write Typed React Components

Create or rename your components with typed props.

#### `src/App.tsx`

```tsx
interface AppProps {
  title?: string;
}

export default function App({ title = 'React + TypeScript' }: AppProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>{title} Project Setup 🚀</h1>
      <p>Configured cleanly with compile-time type safety.</p>
    </div>
  );
}

```

#### `src/index.tsx`

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

### Step 6: Add Type-Checking Script to `package.json`

Because Babel transpiles TypeScript without type-checking, add a dedicated type-check script to your `package.json` using the TypeScript compiler (`tsc`):

```json
"scripts": {
  "start": "webpack serve",
  "build": "tsc --noEmit && webpack",
  "type-check": "tsc --noEmit"
}

```

Running `npm run type-check` will validate all types across your project before running production builds.

Configuring ESLint and Prettier together gives you automated linting for code quality (catching bugs, unused variables, and bad patterns) along with consistent, automatic code formatting without rules conflicting.

Here is a step-by-step guide to setting up ESLint 9+ (using the modern **Flat Config** system) and Prettier in a React + TypeScript project.

---

## Step 1: Install Dependencies

Run the following command to install ESLint, Prettier, TypeScript ESLint plugins, React plugins, and conflict-resolution packages:

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh @typescript-eslint/parser @typescript-eslint/eslint-plugin

```

### Package Breakdown

* **`eslint` & `prettier`:** The core linting and formatting engines.
* **`@typescript-eslint/parser` & `@typescript-eslint/eslint-plugin`:** Enables ESLint to parse and lint TypeScript syntax.
* **`eslint-plugin-react` & `eslint-plugin-react-hooks`:** Rules enforcing React best practices and the Rules of Hooks.
* **`eslint-plugin-react-refresh`:** Enforces rules for Vite React Fast Refresh.
* **`eslint-config-prettier`:** Turns off all ESLint formatting rules that might conflict with Prettier.

---

## Step 2: Configure Prettier

Create two files in the root directory of your project:

### `.prettierrc` (Configuration)

```json
{
  "semi": true,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "arrowParens": "always"
}

```

### `.prettierignore` (Ignore rules)

```text
dist
build
node_modules
coverage
*.min.js

```

---

## Step 3: Configure ESLint 9+ (`eslint.config.js`)

ESLint 9 uses the new **Flat Configuration** file format (`eslint.config.js`). Create this file in your root directory:

```javascript
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 1. Ignore build artifacts
  {
    ignores: ['dist', 'build', 'node_modules'],
  },

  // 2. Base JS recommended rules
  js.configs.recommended,

  // 3. TypeScript & React configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects React version
      },
    },
    rules: {
      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React & Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation instead

      // Fast Refresh safety
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // 4. Prettier rule overrides (MUST BE LAST to disable formatting conflicts)
  prettierConfig,
];

```

---

## Step 4: Add NPM Scripts to `package.json`

Add linting and formatting scripts to your `package.json`:

```json
"scripts": {
  "lint": "eslint . --ext .ts,.tsx",
  "lint:fix": "eslint . --ext .ts,.tsx --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,css,html,json}\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,css,html,json}\""
}

```

---

## Step 5: Configure VS Code for Auto-Formatting on Save (Optional)

To enable automatic formatting and linting every time you save a file in VS Code, create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}

```

> **Note:** Make sure you have the **ESLint** (`dbaeumer.vscode-eslint`) and **Prettier** (`esbenp.prettier-vscode`) extensions installed in VS Code.

---

## Verification

Test your setup in the terminal:

```bash
# Check code formatting across project
npm run format:check

# Run ESLint to detect type or syntax issues
npm run lint

# Auto-fix fixable ESLint issues and format code
npm run lint:fix
npm run format

```

Show me how to set up Husky and lint-staged to run ESLint and Prettier before git commits.

Setting up **Husky** and **lint-staged** ensures that every git commit automatically runs ESLint and Prettier *only on the files staged for commit*. This prevents bad code or unformatted styles from ever reaching your git repository while keeping commit speed fast.

Here is a step-by-step guide to configuring Husky v9+ and lint-staged in your React + TypeScript project.

---

## Step 1: Install Dependencies

Run the following command to install `husky` and `lint-staged` as development dependencies:

```bash
npm install -D husky lint-staged

```

---

## Step 2: Initialize Husky

Initialize Husky in your project repository:

```bash
npx husky init

```

This command automatically does two things:

1. Creates a `.husky/` directory in your root folder.
2. Appends `"prepare": "husky"` to your `package.json` scripts so Husky hooks install automatically when team members run `npm install`.

Your `package.json` scripts section should now include:

```json
"scripts": {
  "prepare": "husky"
}

```

---

## Step 3: Configure `lint-staged` in `package.json`

Add a `"lint-staged"` configuration block to your `package.json`. This tells `lint-staged` which commands to run on specific file extensions before committing:

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md,html}": [
      "prettier --write"
    ]
  }
}

```

> **How it works:**
>
> * For staged `.ts` or `.tsx` files: It runs `eslint --fix` to auto-fix code issues, then runs `prettier --write` to format the code.
> * For other staged files (`.json`, `.css`, etc.): It runs `prettier --write`.
> * Automatically re-stages the fixed files before completing the git commit.
>
>

---

## Step 4: Configure the Pre-Commit Hook

When `npx husky init` ran, it created a sample `.husky/pre-commit` file.

Open `.husky/pre-commit` and update its contents to trigger `npx lint-staged`:

```bash
npx lint-staged

```

---

## Step 5: Test Your Pre-Commit Setup

Now, test if the hook catches errors and auto-formats staged files before a commit:

1. **1. Modify a Staged File:** Make changes with intentional formatting/style issues.
Open any React component (e.g., `src/App.tsx`), add an unused variable or bad formatting (e.g., extra spaces or missing semicolons), and save the file.

2. **2. Stage the Changes:** Stage the file using git add.
Stage the modified file in Git:

```bash
git add src/App.tsx

```

1. **3. Attempt to Commit:** Husky triggers lint-staged automatically.
Run git commit:

```bash
git commit -m "test: verify pre-commit hook"

```

* **If fixable:** Prettier and ESLint will auto-fix formatting and re-stage the file before committing successfully.
* **If unfixable (e.g., syntax/type error):** The commit will be aborted and display the exact ESLint error in your terminal so you can fix it.

---

## Optional: Add Type-Checking to Pre-Commit Hook

Because `lint-staged` passes individual file names to commands, running `tsc` inside `lint-staged` directly does not work well for whole-project type checking.

If you also want to block commits when there are TypeScript compiler errors, add a type-check step directly to `.husky/pre-commit`:

```bash
#!/bin/sh
npx tsc --noEmit
npx lint-staged

```

Now, TypeScript checks the whole project for type errors before `lint-staged` formats and lints the staged files.
