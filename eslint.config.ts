import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierConfig from "@vue/eslint-config-prettier";

export default defineConfigWithVueTs(
  js.configs.recommended,
  pluginVue.configs["flat/recommended"],
  prettierConfig,
  vueTsConfigs.recommended,
  { ignores: ["node_modules/**", "dist/", ".gitignore"] },
  {
    files: ["**/*.{vue,js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      complexity: "warn",
      "dot-notation": "warn",
      eqeqeq: "error",
      "func-style": "warn",
      "new-cap": "warn",
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-explicit-any": "off",
      "no-extra-bind": "warn",
      "no-use-before-define": "error",
      "sort-imports": ["error", { ignoreCase: true, allowSeparatedGroups: true }],
    },
  },
);
