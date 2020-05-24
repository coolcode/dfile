const withCSS = require("@zeit/next-css");
const withSass = require('@zeit/next-sass');
const Dotenv = require('dotenv-webpack');
//const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// https://nextjs.org/docs/api-reference/next.config.js/exportPathMap

module.exports = withCSS(withSass({
    webpack(config, options) {
        /* https://github.com/mrsteele/dotenv-webpack */
        config.plugins.push(new Dotenv({
            allowEmptyValues: true
        }))

        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
        })
        // if (config.mode === 'production') {
        //     if (Array.isArray(config.optimization.minimizer)) {
        //         config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
        //     }
        // }
        config.module.rules.push({
            test: /\.(css|scss|sass)$/,
            use: {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                    //minimize: true
                }
            }
        })

        config.node = {
            fs: "empty"
        }
        //config.plugins.push(new options.webpack.IgnorePlugin(/\/__tests__\//))
        return config
    },
    exportPathMap: async function (
        defaultPathMap,
        {dev, dir, outDir, distDir, buildId}
    ) {

        const pages = []

        for (let p in defaultPathMap) {
            if (p.indexOf('[') < 0) {
                pages[p] = defaultPathMap[p]
            }
        }


        return pages
    },
    publicRuntimeConfig: {
        localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
            ? process.env.LOCALE_SUBPATHS
            : 'none',
    },
}))