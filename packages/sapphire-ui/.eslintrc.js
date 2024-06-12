module.exports = {
  env: {
    es6: true,
    browser: true,
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
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
  ]
}
