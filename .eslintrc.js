module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2010,
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0
  }
};
