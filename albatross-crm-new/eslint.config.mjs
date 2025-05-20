import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptParser from "@typescript-eslint/parser"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin
    },
    rules: {
      // Core ESLint rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      
      // Best practices
      "no-await-in-loop": "error",
      "require-await": "error",
      
      // React/Next.js specific
      "react-hooks/exhaustive-deps": "warn"
    }
  },
  {
    files: ["src/generated/**/*"],
    rules: {
      // Disable all problematic rules for generated files
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-this-alias": "off",
      "no-prototype-builtins": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-redeclare": "off",
      "no-cond-assign": "off",
      "no-useless-escape": "off",
      "no-unused-private-class-members": "off",
      "getter-return": "off",
      "no-constant-binary-expression": "off",
      "no-console": "off",
      "no-empty": "off",
      "no-unreachable": "off"
    }
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/public/**",
      "**/src/generated/prisma/**",
      "/node_modules",
      "/.next",
      "/dist",
      "/src/generated/**",
      "/src/generated/prisma/runtime/*",
      "/src/generated/prisma/wasm.js",
      "src/generated/prisma/**",
      "**/coverage/**"
    ]
  }
]