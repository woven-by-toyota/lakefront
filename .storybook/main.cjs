module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)'
    ],

    // @storybook/addon-mdx-gfm addon is a migration assistant for storybook v7.
    // Read more for MDX: https://storybook.js.org/docs/react/writing-docs/mdx#lack-of-github-flavored-markdown-gfm
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-docs',
        // swc rather than babel: the babel compiler pins @babel/core 7 as a dependency, and mixing
        // that with the Babel 8 at the root breaks transform-typescript on enum declarations
        '@storybook/addon-webpack5-compiler-swc'
    ],

    webpackFinal: async config => {
        config.resolve.modules.push(process.cwd() + '/node_modules');
        config.resolve.modules.push(process.cwd() + '/');

        // this is needed for working w/ linked folders
        config.resolve.symlinks = false;

        // svg handling
        // exclude svg from default webpack fileLoader rule.
        const fileLoaderRule = config.module.rules.find(
            (rule) => rule.test && rule.test.test('.svg')
        );
        // exclude .svg
        fileLoaderRule.exclude = /\.svg$/;

        // use our own loader for handling svgs (svgr)
        // svgo is off to match rollup.config.js, so Storybook renders the svg the bundle ships
        config.module.rules.push({
            test: /\.svg$/,
            enforce: 'pre',
            loader: require.resolve('@svgr/webpack'),
            options: { svgo: false }
        });

        // Add transform for svgs into base64 uri (data:encodedValueHere)
        config.module.rules.unshift({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack', options: { svgo: false } }, 'url-loader']
        });

        return config;
    },

    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    }
};
