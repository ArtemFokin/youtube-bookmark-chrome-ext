const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            if (env !== "development") {
                const htmlWebpackPluginInstance = webpackConfig.plugins.find(
                    (webpackPlugin) =>
                        webpackPlugin instanceof HtmlWebpackPlugin
                );
                if (htmlWebpackPluginInstance) {
                    htmlWebpackPluginInstance.userOptions.excludeChunks = [
                        ...(htmlWebpackPluginInstance.userOptions
                            .excludeChunks || []),
                        "background",
                        "content",
                    ];
                }
            }

            return {
                ...webpackConfig,
                entry: {
                    main: [
                        env === "development" &&
                            require.resolve(
                                "react-dev-utils/webpackHotDevClient"
                            ),
                        paths.appIndexJs,
                    ].filter(Boolean),
                    background: path.resolve(
                        __dirname,
                        "src",
                        "chrome",
                        "background.ts"
                    ),
                    content: path.resolve(
                        __dirname,
                        "src",
                        "chrome",
                        "content.ts"
                    ),
                    // background: "./src/chrome/background.ts",
                },
                output: {
                    ...webpackConfig.output,
                    filename: "static/js/[name].js",
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                },
                resolve: {
                    ...webpackConfig.resolve,
                    fallback: {
                        ...webpackConfig.resolve.fallback,
                        url: require.resolve("url/"),
                    },
                },
            };
        },
        plugins: {
            add: [
                new webpack.optimize.LimitChunkCountPlugin({
                    maxChunks: 1,
                }),
            ],
        },
    },
    devServer: (devServerConfig) => {
        devServerConfig.devMiddleware.writeToDisk = true;
        return devServerConfig;
    },
};
