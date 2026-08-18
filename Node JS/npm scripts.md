To understand **npm scripts** in depth is to unlock one of the most powerful automation layers in Node.js and modern frontend/backend development. Defined inside the `"scripts"` object of your `package.json`, they serve as your project's command center for building, testing, linting, starting servers, and running deployments.

Here is a comprehensive breakdown of how npm scripts work, how they execute, lifecycle hooks, and best practices.

---

## 1. Anatomy of an npm Script

Inside your `package.json`, the `"scripts"` block maps custom script names to shell commands:

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext js,jsx",
    "test": "jest"
  }
}

```

* **Execution:** You run these via your terminal using `npm run <script-name>` (e.g., `npm run dev`).
* *Note:* For certain built-in lifecycle scripts (`start`, `test`, `stop`, `restart`), you can omit the `run` keyword and simply type `npm test` or `npm start`.

---

## 2. How npm Executes Scripts (The PATH Magic)

One of the greatest features of npm scripts is **local dependency resolution**.

When you install a package locally (e.g., `npm install vite --save-dev`), npm automatically adds its executable binary to your project's local `./node_modules/.bin` directory. When you run an npm script, npm **temporarily adds `./node_modules/.bin` to your system's PATH** for the duration of that command.

* **Why this matters:** You don't need to install tools globally on your machine (`vite`, `jest`, `eslint`), nor do you need to type the long relative path (`./node_modules/.bin/vite`). npm knows to look inside your local dependencies first.

---

## 3. Combining and Chaining Commands

You can chain multiple commands together using standard shell operators:

| Operator                                         | Syntax                                              | Description                                                                                                        |
| ------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Sequential (`&&`)**                            | `"build": "tsc && vite build"`                      | Runs `tsc` first. If it succeeds (exit code 0), it runs `vite build`. If `tsc` fails, execution stops immediately. |
| **Parallel (`&`)**                               | `"dev:all": "npm run server & npm run client"`      | Runs both scripts concurrently in the background. (Great for full-stack monorepos).                                |
| **Sequential (Independent `&` / `npm-run-all`)** | `"lint:all": "npm run lint:js && npm run lint:css"` | Runs scripts one after another regardless of previous failure (using `;` in bash, or tools like `npm-run-all`).    |

---

## 4. Passing Arguments to npm Scripts (`--`)

If you want to pass custom arguments or flags from your terminal down into the underlying CLI tool executed by npm, you must use the **double-dash (`--`)** separator.

* **Example:** Suppose your test script is `"test": "jest"`. If you want to run Jest on a specific file, passing arguments directly like `npm run test src/App.test.js` might fail or get intercepted by npm.
* **Correct Syntax:**

```bash
npm run test -- --watch

```

The `--` tells npm: *"Everything after this point belongs to the script, not to npm itself."*

---

## 5. Lifecycle Scripts (`pre` and `post` hooks)

npm automatically recognizes special naming conventions that allow you to run tasks before or after a primary script without manual chaining.

* If you define a script named `build`, npm will automatically look for and execute:

1. `prebuild` (runs *before* `build`)
2. `build` (the main task)
3. `postbuild` (runs *after* `build`)

### Example

```json
"scripts": {
  "prebuild": "rimraf dist",
  "build": "vite build",
  "postbuild": "echo 'Build completed successfully!'"
}

```

Running `npm run build` will automatically clean the `dist` folder first (`prebuild`), compile the app (`build`), and then print the success message (`postbuild`).

---

## 6. Environment Variables in Scripts

You can define custom environment variables directly inline within your scripts. This works across operating systems if you use cross-platform tools like `cross-env`, or natively in Unix-based environments:

```json
"scripts": {
  "start:prod": "cross-env NODE_ENV=production node server.js"
}

```

Additionally, npm automatically injects environment variables about the current package into your running scripts, prefixed with `npm_package_` (e.g., `process.env.npm_package_version` will return your app's version string).
