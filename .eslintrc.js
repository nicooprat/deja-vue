const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  root: true,
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['sort-class-members', 'prettier', 'vue'],
  extends: ['plugin:vue/recommended', 'eslint:recommended', '@vue/airbnb', 'prettier', 'prettier/vue'],
  rules: {
    camelcase: [
      'error',
      {
        properties: 'always',
      },
    ],
    'consistent-return': 'off',
    curly: ['error', 'all'],
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'import/no-relative-parent-imports': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
      },
    ],
    'import/prefer-default-export': 'off',
    'no-console': IS_DEV ? 'warn' : 'error',
    'no-debugger': IS_DEV ? 'warn' : 'error',
    'no-return-assign': ['error', 'always'],
    'object-curly-newline': 'off',
    'object-shorthand': [
      'error',
      'always',
      {
        avoidQuotes: false,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        printWidth: 120,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
      },
    ],
    quotes: ['error', 'single', { allowTemplateLiterals: false, avoidEscape: true }],
    radix: ['error', 'always'],
    'sort-class-members/sort-class-members': [
      'error',
      {
        accessorPairPositioning: 'getThenSet',
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
        ],
      },
    ],
    'vue/attribute-hyphenation': ['error', 'never'],
  },
  overrides: [
    {
      files: ['src/store/*'],
      rules: {
        'no-param-reassign': 'off',
      },
    },
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  settings: {
    'import/core-modules': ['path', 'os'],
  },
};
