module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/preset-typescript'
    ],
    overrides: [
        {
            /*
             * Babel 8's preset-react enables the jsx parser for every file it applies to, and the
             * isTSX option that used to scope that was removed. A .ts file cannot hold jsx, while a
             * generic such as <T = any> parses as a jsx tag, so the preset is kept off that one
             * extension. The .js test files do hold jsx, so they stay in.
             */
            test: /\.(m?js|jsx|tsx)$/,
            presets: [
                ['@babel/preset-react', {
                    'runtime': 'automatic'
                }]
            ]
        }
    ]
};
