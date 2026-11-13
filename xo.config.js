/**
 * @import {FlatXoConfig} from 'xo'
 */

/** @type {FlatXoConfig} */
const xoConfig = [
  {
    name: 'default',
    prettier: 'compat',
    rules: {
      '@typescript-eslint/no-shadow': 'off',
      complexity: 'off',
      curly: 'off',
      'import-x/no-cycle': 'error',
      'import-x/order': 'off',
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-line-alignment': 'off',
      'jsdoc/informative-docs': 'off',
      'jsdoc/reject-any-type': 'off',
      'jsdoc/require-asterisk-prefix': 'off',
      'max-depth': 'off',
      'prefer-arrow-callback': 'off',
      'require-unicode-regexp': 'off',
      'unicorn/better-dom-traversing': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-immediate-mutation': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-code-point': 'off',
      'unicorn/prefer-continue': 'off',
      'unicorn/prefer-early-return': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/require-array-sort-compare': 'off',
      'unicorn/single-line-block-comment-style': 'off'
    },
    space: true
  },
  // Wrong.
  {ignores: ['**/*.md']},
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/array-type': ['error', {default: 'generic'}],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // Empty interfaces are used to register data.
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {allowInterfaces: 'with-single-extends'}
      ],
      // `null` is allowed in options.
      '@typescript-eslint/no-restricted-types': 'off'
    }
  },
  {
    files: ['package.json'],
    rules: {
      'package-json/no-orphan-types': 'off',
      'package-json/require-engines': 'off',
      'package-json/sort-files': 'off',
      'package-json/sort-properties': 'off'
    }
  }
]

export default xoConfig
