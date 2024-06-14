module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
    browser: true
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],

  parser: 'vue-eslint-parser',

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
  },

  plugins: [
    'vue',
    '@typescript-eslint'
  ],

  rules: {
    'prettier/prettier': [
      'error',
      {
        'semi': false,
        'singleQuote': true
      }
    ]
  }
}
