import baseConfig from "@tin-ai-lens/config/eslint/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: ["build/**", ".plasmo/**", "dist-test/**"],
  },
];
