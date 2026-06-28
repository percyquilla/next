import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // MUI v9 theme.vars is not fully typed — explicit any is necessary
      "@typescript-eslint/no-explicit-any": "off",
      // React Compiler memoization rules: too strict for manual useCallback patterns
      "react-hooks/preserve-manual-memoization": "off",
      // fetchMessages is async; setState is called inside an async callback, not synchronously
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
