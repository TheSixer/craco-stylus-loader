# craco-stylus-loader

Stylus plugin for [Craco](https://www.npmjs.com/package/@craco/craco). 

Allows using Stylus `.styl` files in create-react-app 4.x and also works with TypeScript.

- CSS Module imports: `import styles from "./App.module.styl";`
- Global imports: `import "./App.module.styl";`

## Getting started with create-react-app

```
$ create-react-app my-app

$ cd my-app

$ yarn add @craco/craco stylus stylus-loader craco-stylus-loader
```

<sub>package.json</sub>

```diff
   "scripts": {
-    "start": "react-scripts start",
+    "start": "craco start",
-    "build": "react-scripts build",
+    "build": "craco build",
-    "test": "react-scripts test",
+    "test": "craco test",
   },
```

<sub>craco.config.js</sub>

```js
const CracoStylusLoaderPlugin = require("craco-stylus-loader");

module.exports = {
  plugins: [
    {
      plugin: CracoStylusLoaderPlugin
    }
  ]
};
```
