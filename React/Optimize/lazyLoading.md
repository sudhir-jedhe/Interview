// For example suppose you are visiting an e-commerce website where there are many list of items, It does not makes any sense to load all the items at once, instead it is better to fetch more items after user has seen the previous items.

// Often we pre-fetch say 20 items and then fetch more items once the user has seen them by either scrolling down to end or with pagination.

// The no of items that needs to fetched depend upon the UI/UX and how many items we want user to see at once.

// I have already created the pagination component in react, this time I am going to do the lazy loading.

// In this you can determine when do you want to lazy load the items, I will be doing it after user has scrolled to the end vertically.

// Lazy loading in react.
// There are few extra packages which we will be utilizing for our development.

// classnames: This helps us to use CSS classes as javascript objects, we just have to name our CSS file as filename.module.css.
// lodash: Set of helpful utility function.

```js
import React, { Component } from "react";
import styles from "./index.module.css";
import { debounce } from "lodash";

const URL = "https://reqres.in/api/users";

class LazyLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      currentPage: 0,
      isLoading: false,
      error: false
    };
  }

  componentDidMount() {
    this.fetchData();
    window.addEventListener("scroll", debounce(this.lazyLoad, 300));
    window.addEventListener("resize", debounce(this.lazyLoad, 300));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", () => {});
    window.removeEventListener("resize", () => {});
  }

  lazyLoad = () => {
    const advance = 100;
    const { innerHeight, scrollY } = window;
    const { offsetHeight } = document.body;
    if (innerHeight + scrollY + advance >= offsetHeight) {
      // you're at the bottom of the page
      this.fetchData();
    }
  };

  fetchData = async () => {
    try {
      const { currentPage, list } = this.state;
      this.setState({
        error: false,
        isLoading: true
      });

      const res = await fetch(`${URL}?page=${currentPage + 1}`);
      const { data } = await res.json();

      this.setState({
        list: [...list, ...data],
        currentPage: currentPage + 1
      });
    } catch (e) {
      this.setState({
        error: true
      });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { list, isLoading, error } = this.state;

    const items = list.map(e => (
      <div key={e.id} className={styles.item}>
        <div className={styles.wrapper}>
          <img src={e.avatar} alt={e.first_name} />
          <span>
            Name: {e.first_name} {e.last_name}
          </span>
          <span>Email: {e.email}</span>
        </div>
      </div>
    ));

    return (
      <>
        {isLoading && <div className={styles.fullScreenLoader}></div>}
        <div className={styles.container}>{items}</div>
        {error && (
          <div className={styles.error}>
            There was some error while fetching the data
          </div>
        )}
      </>
    );
  }
}

export default LazyLoading;



.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 33.333333%;
    flex: 0 0 50%;
    max-width: 50%;
    padding: 0 10px;
    margin: 10px 0;
  }

  .wrapper {
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
    padding: 25px;
    text-align: center;
    background: #fbe9e7;
  }

  .wrapper > img {
    display: inline-block;
    width: 100%;
    max-width: 18em;
    margin: 0 auto;
  }

  .wrapper > span {
    display: inline-block;
    width: 100%;
    margin: 5px;
  }

  .fullScreenLoader {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.75);
  }

  .error {
    color: red;
    text-transform: capitalize;
    font-size: 18px;
  }

```

**Lazy loading** in React is a technique where components or other resources (like images, scripts, etc.) are only loaded when they are needed, rather than loading everything upfront. This can significantly improve the performance and user experience of your application, especially for large or complex React apps.

Here are the key **benefits of lazy loading in React**:

### 1. **Improved Initial Load Time**

- **Benefit**: By deferring the loading of non-essential components, lazy loading helps reduce the initial bundle size. This leads to **faster initial page load times**.
- **How it works**: Only the critical components (i.e., those visible or needed immediately) are loaded first, while others (e.g., components for later navigation or interactions) are loaded on demand as the user interacts with the application.

### 2. **Reduced Bundle Size**

- **Benefit**: Lazy loading reduces the size of the JavaScript bundle that needs to be loaded initially.
- **How it works**: Instead of sending the entire application in a single bundle, React components are split into smaller chunks. Only the code necessary for the initial view is loaded first, and the remaining code is loaded when required.

### 3. **Faster Time to Interactive (TTI)**

- **Benefit**: With lazy loading, the time it takes for the application to become interactive is reduced because fewer resources are loaded upfront.
- **How it works**: Since the critical parts of the app are loaded first, the user can start interacting with the app while other non-essential parts load in the background.

### 4. **Efficient Resource Management**

- **Benefit**: Resources (e.g., scripts, images, and components) are only loaded when they are needed, making your app more **resource-efficient**.
- **How it works**: This can be especially useful in single-page applications (SPAs) where various sections of the app might not be needed immediately or at all.

### 5. **Improved User Experience (UX)**

- **Benefit**: Lazy loading leads to a smoother and more responsive user experience because content loads progressively.
- **How it works**: The user gets to interact with the application faster, without waiting for all components to load. When other parts of the app load, the user is often unaware of the process, resulting in a seamless experience.

### 6. **Reduced Bandwidth Consumption**

- **Benefit**: Lazy loading reduces the amount of data transferred, which can help in environments with limited bandwidth or slower network connections.
- **How it works**: Only the necessary code and resources are loaded, so users with slower internet connections won’t need to download unnecessary files, resulting in better performance, especially on mobile devices.

### 7. **Better Performance on Mobile Devices**

- **Benefit**: Lazy loading helps improve the performance of web applications on **mobile devices** with limited resources (processing power and bandwidth).
- **How it works**: By reducing the initial loading time and deferring the loading of non-essential resources, mobile users experience faster load times and smoother interactions.

### 8. **Improved SEO for Initial Page Load**

- **Benefit**: While SEO is primarily affected by server-side rendering, lazy loading ensures that important parts of the app (e.g., content visible to the user) load quickly and are ready to be indexed.
- **How it works**: The initial critical content is loaded first, which improves the time-to-first-contentful-paint (FCP) and time-to-interactive (TTI), leading to better SEO performance as search engines can index this content faster.

### 9. **On-demand Loading of Routes**

- **Benefit**: Lazy loading is especially useful when combined with **React Router** for loading route-based components.
- **How it works**: When the user navigates to a new route, only the components necessary for that route are loaded. This reduces the amount of JavaScript loaded upfront and improves routing performance.

### 10. **Code Splitting**

- **Benefit**: Lazy loading works in conjunction with **code splitting** to load only the JavaScript needed for the current view.
- **How it works**: Tools like **Webpack** and **React's `React.lazy()`** automatically split the code into smaller chunks based on the components, so users only download the code that is required for the current page.

### 11. **Cost Savings for Cloud Hosting and CDN**

- **Benefit**: By reducing the initial bundle size and only loading code when necessary, lazy loading helps reduce the data transferred from your servers, resulting in potential **cost savings** in terms of bandwidth and cloud hosting.
- **How it works**: You will pay less for data transfer as users will only download the parts of the application they actually need, improving efficiency and reducing infrastructure costs.

### 12. **Better Caching**

- **Benefit**: When components are lazy-loaded, they can be cached more effectively, as only specific chunks are loaded based on user interaction.
- **How it works**: Since only specific code chunks are loaded at a time, the browser can cache these chunks, and subsequent visits can load these chunks much faster, further enhancing performance.

---

### **Example: React Lazy Loading Implementation**

In React, lazy loading is typically implemented with `React.lazy()` and `Suspense`. Here is an example:

```javascript
import React, { Suspense } from "react";

// Lazy-load the component
const MyComponent = React.lazy(() => import("./MyComponent"));

function App() {
  return (
    <div>
      <h1>Lazy Loading Example</h1>

      {/* Suspense will show a fallback UI while the component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </div>
  );
}

export default App;
```

- **`React.lazy()`**: This function is used to dynamically import components only when they are needed.
- **`Suspense`**: This component is used to display a fallback UI (like a loading spinner) while the lazy-loaded component is being fetched.

---

### **Conclusion**

Lazy loading in React provides significant performance benefits, including faster initial load times, reduced bandwidth usage, and a smoother user experience. By deferring the loading of non-essential resources, you can improve both the performance of your application and the experience of your users, especially on mobile devices or slow networks.

### Lazy Loading with `React.lazy()`, `Suspense`, and Route-based Splitting using Webpack, Babel, and Network Efficiency

When building large React applications, one of the most effective strategies for improving performance is to combine **route-based lazy loading** (i.e., only loading components or routes when they are needed) with **React’s `Suspense`** and **Webpack’s code splitting**.

This approach makes your application more efficient by splitting your app into smaller chunks and loading only the parts that are needed. Let's explore how to set this up step by step, including how it integrates with **Webpack**, **Babel**, and **network efficiency** considerations.

### **Steps to Set Up Route-Based Lazy Loading in React**

#### 1. **Install Dependencies**

First, ensure that you have the necessary dependencies installed:

```bash
npm install react-router-dom react@latest react-dom@latest
```

You'll also need **Babel** and **Webpack** for compiling and bundling your app. If you don’t already have them set up, you'll need the following:

```bash
npm install @babel/core @babel/preset-env @babel/preset-react webpack webpack-cli webpack-dev-server babel-loader react-refresh
```

### 2. **Set Up Webpack Configuration for Code Splitting**

Webpack allows you to split your application into smaller bundles that can be loaded on demand. You can configure Webpack to enable **code splitting** for route-based components.

Here’s an example Webpack configuration for splitting code:

```js
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].bundle.js",
    chunkFilename: "[name].[contenthash].chunk.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
```

### 3. **Set Up Babel Configuration for React and JSX**

Babel needs to be configured to transpile JSX and modern JavaScript (ES6+) into code that can be understood by browsers.

Here’s a sample **`.babelrc`** configuration:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

- **`@babel/preset-env`** ensures compatibility with the latest JavaScript features.
- **`@babel/preset-react`** enables JSX transformation.

### 4. **Implement Route-Based Lazy Loading in React with `React.lazy()`**

In React, you can use `React.lazy()` to dynamically import components when they are needed. To achieve route-based lazy loading, we can integrate `React.lazy()` with **React Router**.

Here’s an example of how to set up **route-based lazy loading** using `React.lazy()` and `Suspense`:

```javascript
// src/App.js
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Lazy load route-based components
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));

function App() {
  return (
    <Router>
      <div>
        <h1>React App with Lazy Loading</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
```

- **`React.lazy()`**: The components are dynamically imported when they are required. The routes `Home`, `About`, and `Contact` will only be loaded when the user navigates to them.
- **`Suspense`**: The `Suspense` component wraps the dynamically loaded routes and shows a fallback UI (like a loading spinner) while the component is loading.

### 5. **Optimize Network Efficiency**

#### 5.1 **Webpack Code Splitting and Caching**

Webpack can be configured to split the code into chunks, and you can take advantage of **long-term caching** using content hashing. This ensures that when the user revisits the page, they only need to load the parts of the application that have changed.

In the Webpack configuration, the `[contenthash]` in the `filename` ensures that files are uniquely hashed based on their content. This is crucial for caching because browsers can cache unchanged bundles, reducing the amount of data needed for subsequent visits.

#### 5.2 **Lazy Load Only Critical Resources**

You can further optimize performance by **lazy loading non-essential resources** like images, CSS files, or additional scripts only when they are required.

For example, you can use the `loading="lazy"` attribute for images:

```jsx
<img src="large-image.jpg" alt="Lazy loaded image" loading="lazy" />
```

#### 5.3 **Preload Key Routes**

Another technique for improving network efficiency is **preloading critical routes** before they are needed. You can use `<link rel="preload" />` in your HTML to preload important components or resources.

For example, you can preload the JavaScript bundle for a critical route:

```html
<link rel="preload" href="about.bundle.js" as="script" />
```

This will load the necessary resources in the background, ensuring faster transitions to the route.

### 6. **Final Code Example**

Let’s put everything together:

#### **index.js**

```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
```

#### **Home.js (in `src/pages/Home.js`)**

```javascript
import React from "react";

function Home() {
  return <div>Welcome to the Home Page!</div>;
}

export default Home;
```

#### **About.js (in `src/pages/About.js`)**

```javascript
import React from "react";

function About() {
  return <div>About Us</div>;
}

export default About;
```

#### **Contact.js (in `src/pages/Contact.js`)**

```javascript
import React from "react";

function Contact() {
  return <div>Contact Us</div>;
}

export default Contact;
```

#### **webpack.config.js (optimized for code splitting)**

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].bundle.js",
    chunkFilename: "[name].[contenthash].chunk.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all", // Splitting common chunks
    },
  },
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
```

---

### **Summary**

1. **Lazy loading** and **Suspense** improve performance by loading components only when needed, reducing the initial page load time and speeding up time-to-interactive.
2. **Route-based splitting** with Webpack ensures that only the necessary code is loaded for the current route, further optimizing loading time.
3. **Webpack optimizations** (like code splitting and caching) and **Babel** work together to ensure that your React app is modern, fast, and efficient.
4. By combining lazy loading with **network optimizations** (such as preloading and resource caching), your application becomes more efficient, reducing both network usage and server load.

This approach ensures that your React app is optimized for both **performance** and **user experience**!
