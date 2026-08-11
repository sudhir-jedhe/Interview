
👉 Tree shaking is like cleaning out your closet. It removes unused stuff (code) from your app's bundle during building. This helps keep your app light and fast.

👉Simple Terms: The process of eliminating dead code before adding it to our bundle, is called tree-shaking.

👉 Example:
➡ Imagine you have a toolbox with lots of tools, but you only use a few. When you build your React app, tree shaking finds and keeps only the tools you actually use.

➡ So, if you import a big library but only use a small part of it, tree shaking tosses out the rest. This means your app loads quicker because it's not carrying unnecessary stuff.

👉 Important Note: Tree shaking is a feature provided by modern JavaScript bundlers like Webpack, which analyze the imported modules in your code and remove unused code during the build process.
