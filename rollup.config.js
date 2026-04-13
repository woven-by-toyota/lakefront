import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' with { type: 'json' };
import { readFileSync, writeFileSync } from 'fs';

// Custom plugin to add emotion.d.ts reference to generated types
const addEmotionReference = () => ({
    name: 'add-emotion-reference',
    writeBundle() {
        const dtsFile = 'dist/index.d.ts';
        const content = readFileSync(dtsFile, 'utf-8');
        // Only add if not already present
        if (!content.includes('reference path="./emotion.d.ts"')) {
            const withReference = `/// <reference path="./emotion.d.ts" />\n\n${content}`;
            writeFileSync(dtsFile, withReference);
        }
    }
});

// Create external dependencies list
const EXTERNAL_DEPS = [
    // All peer dependencies
    ...Object.keys(pkg.peerDependencies || {}),
    // All dependencies (since this is a library, don't bundle dependencies)
    ...Object.keys(pkg.dependencies || {}),
    // React internals
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    // Common runtime helpers
    'tslib'
];

export default [
    {
        input: 'src/index.ts',
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'esm' }
        ],
        plugins: [
            del({ targets: ['dist/*'] }),
            resolve({
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                // Support absolute imports from project root (matching tsconfig baseUrl)
                moduleDirectories: ['node_modules', '.']
            }),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                exclude: ['node_modules/**', '**/*.d.ts', '**/*.d.mts', 'src/stories/**'],
                outputToFilesystem: true,
                compilerOptions: {
                    noEmitOnError: false  // Continue building despite type errors
                }
            }),
            url(),
            svgr({
                svgo: false  // Disable SVGO optimization to avoid plugin config issues
            }),
            terser(),
            copy({
                targets: [
                    { src: 'src/emotion.d.ts', dest: 'dist' }
                ],
                hook: 'writeBundle'  // Copy after bundle is written
            }),
            addEmotionReference()  // Add reference directive to index.d.ts
        ],
        external: (id) => {
            // Mark a module as external if it matches any of our external patterns
            return EXTERNAL_DEPS.some(ext => id === ext || id.startsWith(ext + '/'));
        }
    },
];
