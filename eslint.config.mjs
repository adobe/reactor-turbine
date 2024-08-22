import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        _satellite: true,
        ...globals.browser,
        ...globals.jasmine,
        ...globals.node
      }
    }
  },
  {
    rules: {
      camelcase: [2, { properties: 'always' }],
      indent: [2, 2, { SwitchCase: 1 }], // 2 spaces indentation
      semi: [2, 'always'],
      'keyword-spacing': [2],
      'space-before-function-paren': [
        2,
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      'space-before-blocks': [2, 'always'],
      'space-infix-ops': [2, { int32Hint: false }],
      quotes: [1, 'single', 'avoid-escape'],
      'max-len': [
        2,
        100,
        4,
        {
          ignoreUrls: true,
          ignorePattern:
            '^(\\s*(var|let|const)\\s.+=\\s*require\\s*\\()|(^\\s*import)'
        }
      ],
      eqeqeq: [2, 'allow-null'],
      strict: [0, 'safe'],
      'no-nested-ternary': [2],
      'no-underscore-dangle': 0,
      'comma-style': [2],
      'one-var': [2, 'never'],
      'brace-style': [2, '1tbs', { allowSingleLine: true }],
      'consistent-this': [0, 'self'],
      'no-prototype-builtins': 0
    }
  }
];
