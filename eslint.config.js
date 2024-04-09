import globals from 'globals';
import NetflixCommon from '@netflix/eslint-config';

export default [
  {
    ...NetflixCommon,
    files: ['**/*.js'],
    languageOptions: { globals: globals.browser },
    ignores: [
      'server.js',
      'test.js',
      'demo/react/*',
    ],
  },
  {
    ...NetflixCommon,
    files: ['demo/react/**/*.js'],
    languageOptions: { globals: { ...globals.browser, React: 'readonly', ReactDOM: 'readonly' } },
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
