import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import { flatConfigs as importConfigs } from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import { configs as tsEslintConfigs } from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  {
    ignores: ['preset.js', 'manager.js', 'preview.js'],
  },
  {
    plugins: { js, 'unused-imports': unusedImports },
    extends: [
      js.configs.recommended,
      tsEslintConfigs.recommended,
      tsEslintConfigs.stylistic,
      pluginReact.configs.flat.recommended,
      eslintConfigPrettier,
      importConfigs.recommended,
      importConfigs.typescript,
    ],
    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: true,
      },
    },

    rules: {
      curly: ['error', 'all'],

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'parent',
            },
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/first': 'error',
      'import/no-unresolved': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',

      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/no-unused-vars': 'off',

      'react/react-in-jsx-scope': 'off',
    },
  },
]);
