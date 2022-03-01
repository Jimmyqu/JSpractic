module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'plugin:vue/recommended', 
    'plugin:unicorn/recommended'
  ],
  plugins: [],
  overrides: [ 
    {
      files: ['.eslintrc.js'], // 某些需要特殊对待的文件 可覆盖
      rules: {
        quotes: [2, 'single'],
        'unicorn/prefer-module': 0,
      },
    },
  ],
  rules: {
    'no-console': 1,
    semi: 0,
    quotes: [1, 'single'],
  },
};
