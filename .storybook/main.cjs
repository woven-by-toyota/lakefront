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
        '@storybook/addon-webpack5-compiler-babel'
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
        config.module.rules.push({
            test: /\.svg$/,
            enforce: 'pre',
            loader: require.resolve('@svgr/webpack')
        });

        // Add transform for svgs into base64 uri (data:encodedValueHere)
        config.module.rules.unshift({
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader']
        });

        return config;
    },

    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    }
};
