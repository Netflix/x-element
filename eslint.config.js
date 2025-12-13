import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import NetflixCommon from '@netflix/eslint-config';
import babelParser from '@babel/eslint-parser';

export default [
  jsdoc.configs['flat/recommended'],
  {
    ...NetflixCommon,
    files: ['**/*.js'],
    languageOptions: { globals: globals.browser },
    ignores: ['server.js', 'test.js'],
  },
  {
    files: ['x-element.js', 'x-element-next.js', 'x-parser.js', 'x-template.js'],
    plugins: { jsdoc },
    rules: {
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns-description': 'off',
    },
  },
  {
    ...NetflixCommon,
    files: ['performance.js', 'server.js', 'test.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.src.js'],
    languageOptions: {
      parser: babelParser,
      globals: globals.browser,
    },
  },
  {
    ignores: [
      'node_modules',
      'demo/react/index.js',         // generated from .jsx file
      'performance/react/index.js',  // generated from .jsx file
      'test-next/*.js',              // transpiled decorator tests (test-next directory)
      '!test-next/*.src.js',         // but DO lint decorator source files
      'test/test-decorators.js',     // transpiled decorator tests (for old test suite)
      'transpile-decorators.js',     // build script
      '*.d.ts',
    ],
  },
  {
    settings: {
      jsdoc: {
        preferredTypes: [
          // TypeScript knows about this, but eslint does not.
          'TemplateStringsArray',
          'AddEventListenerOptions',
          'CustomElementConstructor',
        ],
      },
    },
  },
];
