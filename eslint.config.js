import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import NetflixCommon from '@netflix/eslint-config';

export default [
  jsdoc.configs['flat/recommended'],
  {
    ...NetflixCommon,
    files: ['**/*.js'],
    languageOptions: { globals: globals.browser },
    ignores: ['server.js', 'test.js'],
  },
  {
    files: ['x-element.js', 'x-template.js', 'etc/ready.js'],
    plugins: { jsdoc },
    rules: {
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns-description': 'off',
    },
  },
  {
    ...NetflixCommon,
    files: ['server.js', 'test.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    ignores: [
      'node_modules',
      '*.d.ts',
    ],
  },
];
