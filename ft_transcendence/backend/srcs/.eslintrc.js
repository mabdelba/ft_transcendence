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
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    //the interface name should start with I
    '@typescript-eslint/interface-name-prefix': 'off',
    // you are not required to explicitly declare return types for your functions
    '@typescript-eslint/explicit-function-return-type': 'off',
    //Allows omitting explicit return types on functions and methods within classes
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Flags unused variables to ensure code cleanliness.
    "@typescript-eslint/no-unused-vars": "error",
    // Disallows using the any type to encourage explicit typing.
    '@typescript-eslint/no-explicit-any': 'error',
    //Enforces naming conventions specific to NestJS, such as using PascalCase for class names and camelCase for variables and methods.
    //see "Naming conventions specific to NestJS" in "NOTES" list.
    '@nestjs-eslint/naming-convention': ['error',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    //Discourages the use of magic numbers without explicit explanation or constants.
    "@nestjs-eslint/no-magic-numbers": "error",
    //Detects duplicate imports of modules within the same file.
    "@nestjs-eslint/no-duplicate-modules": "error",
    //Detects unnecessary classes that don't provide any functionality.
    "@nestjs-eslint/no-extraneous-class": "error",


    // Code style and formatting
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
