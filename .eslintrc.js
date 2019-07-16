module.exports = {
  root: true,
  extends: 'eslint:recommended',
  rules: {
    eqeqeq: ['error', 'allow-null'],
    'no-console': 'warn',
    'no-redeclare': ['error', { builtinGlobals: true }],
    'no-shadow': [
      'warn',
      { builtinGlobals: true, hoist: 'functions', allow: [] },
    ],
    'no-undef': 'error',
    'no-undef-init': 'error',
    'no-unused-vars': 'warn',
    'no-var': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-const': 'error',
    'require-yield': 1,
    'no-prototype-builtins': 1,
  },
  env: {
    es6: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
};
