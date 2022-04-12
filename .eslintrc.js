// We should periodically check in on the "recommended" rules we're extending
// and remove redundancies:
// https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js

/* eslint-env node */
module.exports = {
  root: true,
  extends: 'eslint:recommended',
  rules: {
    eqeqeq: 'error',
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
    }],
    'no-console': 'warn',
    'no-prototype-builtins': 'warn',
    'no-shadow': 'warn',
    'no-undef-init': 'error',
    'no-unused-vars': 'warn',
    'no-var': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-const': 'error',
    'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'semi': 'warn',
  },
  env: {
    es6: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
};
