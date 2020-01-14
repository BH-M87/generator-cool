import { observable } from "mobx";
import isArray from "cool-utils/es/utils/isArray";

// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context("./", false, /\.js$/);

const store = {};
context
  .keys()
  .filter(key => key !== "./index.js")
  .forEach(key => {
    const result = /^\.\/(.+)\.js$/.exec(key);
    const name = isArray(result) ? result[1] : null;
    if (!name) {
      return;
    }
    store[name] = observable(context(key).default);
  });

export default store;
