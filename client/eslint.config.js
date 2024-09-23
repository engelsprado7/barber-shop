// add react and eslint-plugin-astro to your dependencies
import eslintPluginAstro from 'eslint-plugin-astro';
import reactPlugin from 'eslint-plugin-react';
export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
    },
  },
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      // override/add rules settings here, such as:
      "astro/no-set-html-directive": "error",
      "no-unused-vars": "error",
      "no-unused-vars": "error",
      //jsx-indent
      "react/jsx-indent": [2, 2, { indentLogicalExpressions: true }],
      "react/jsx-newline": [2, { "prevent": true, "allowMultilines": true }],
      "react/jsx-curly-newline": ["error", { "multiline": "consistent", "singleline": "consistent" }],
    }
  }
];