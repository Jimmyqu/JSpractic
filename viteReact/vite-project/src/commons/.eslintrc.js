// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:compat/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    'no-shadow': 2,
    'default-param-last': 0,
    'space-before-function-paren': 0,
    'unicorn/prevent-abbreviations': 0,
    'unicorn/prefer-reflect-apply': 0,
    'unicorn/catch-error-name': 0,
    'unicorn/no-for-loop': 0,
    'unicorn/no-array-for-each': 0,
    'unicorn/prefer-dom-node-append': 0,
    'unicorn/prefer-dom-node-remove': 0,
    'unicorn/prefer-dom-node-text-content': 0,
    'unicorn/no-null': 0,
    'unicorn/no-array-reduce': 0,
  },
};
