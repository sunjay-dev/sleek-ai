import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-control-regex": "off",
    },
  },
  tseslint.configs.recommended,
  globalIgnores(["frontend/**", "**/dist/**", ".pnpm-store/**", "**/node_modules/**", "**/tests/**"]),
]);
