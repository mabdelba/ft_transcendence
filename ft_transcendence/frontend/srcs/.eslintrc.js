module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', '*.js'],
  rules: {
    // you are not required to explicitly declare return types for your functions
    '@typescript-eslint/explicit-function-return-type': 'off',
    //Allows omitting explicit return types on functions and methods within classes
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Flags unused variables to ensure code cleanliness.
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    // Disallows using the any type to encourage explicit typing.
    '@typescript-eslint/no-explicit-any': 'error',
    //Enforces naming conventions specific to NestJS, such as using PascalCase for class names and camelCase for variables and methods.
    //see "Naming conventions specific to NestJS" in "NOTES" list.
    //the interface name shouldn't start with I
    '@typescript-eslint/naming-convention': ['error',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: ['typeLike', 'interface'],
        format: ['PascalCase'],
      },
    ],
    //Discourages the use of magic numbers without explicit explanation or constants.
    "no-magic-numbers": "off",
    "@typescript-eslint/no-magic-numbers": "error",
    //Detects unnecessary classes that don't provide any functionality.
    "@typescript-eslint/no-extraneous-class": "error",


    // Code style and formatting
    indent: ['error', 2],
    // quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
