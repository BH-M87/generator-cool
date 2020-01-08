// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context('./', false, /\.js$/);

export default context
  .keys()
  .filter(item => item !== './index.js')
  .map(key => context(key).default);
