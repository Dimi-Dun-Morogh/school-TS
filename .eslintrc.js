module.exports = {
  extends: ['airbnb-typescript/base'],
  parserOptions: {
      project: './tsconfig.eslint.json'
  },
    rules: {
        'no-console': 'off',
        'import/prefer-default-export': 'off',
         'max-len': 'warn',
         'no-continue': 'off'
    }
};