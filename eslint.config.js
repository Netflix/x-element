import globals from 'globals';
import js from '@eslint/js';

const common = {
  rules: {
    ...js.configs.recommended.rules,
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
    }],
    'eqeqeq': 'error',
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
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
};

export default [
  {
    files: ['**/*.js'],
    languageOptions: { globals: globals.browser },
    ...common,
    ignores: [
      'test.js',
      'demo/react/*',
    ],
  },
  {
    files: ['demo/react/**/*.js'],
    languageOptions: { globals: { ...globals.browser, React: 'readonly', ReactDOM: 'readonly' } },
    ...common,
  },
  {
    files: ['test.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    ...common,
  },
  {
    ignores: [
      'node_modules',
      '*.d.ts',
    ],
  },
];
