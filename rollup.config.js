import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' with { type: 'json' };

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
            terser()
        ],
        external: (id) => {
            // Mark a module as external if it matches any of our external patterns
            return EXTERNAL_DEPS.some(ext => id === ext || id.startsWith(ext + '/'));
        }
    },
];
