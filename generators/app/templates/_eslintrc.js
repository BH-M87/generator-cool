module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: ['react'],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  env: {
    browser: true,
    mocha: true,
    es6: true,
  },
  rules: {
    'spaced-comment': [0],
    'class-methods-use-this': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'no-restricted-syntax': 0,
    'react/jsx-closing-tag-location': 0,
    'arrow-parens': 0,
    'react/prefer-stateless-function': 0,
    'react/require-default-props': 0,
    'jsx-a11y/img-redundant-alt': 0,
  },
};
