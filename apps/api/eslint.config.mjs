import baseConfig from "@tin-ai-lens/config/eslint/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
];
