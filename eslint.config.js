import globals from 'globals';
import storybook from 'eslint-plugin-storybook';
import babelParser from '@babel/eslint-parser';

export default [
    ...storybook.configs['flat/recommended'],
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            /*
             * Babel parses the TypeScript, through the preset-typescript in babel.config.cjs, rather
             * than typescript-eslint, which refuses to load against TypeScript 7 and has no release
             * or canary that supports it. No type-aware rule is enabled here, so nothing is lost.
             */
            parser: babelParser,
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                requireConfigFile: true,
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: globals.browser
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single']
        }
    }
];
