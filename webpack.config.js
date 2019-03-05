//@ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ImageminPlugin = require("imagemin-webpack");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
const imageminSvgo = require("imagemin-svgo");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
/* eslint-enable */

// const ip = process.env.WDS_HOST || "localhost";
const ip = "localhost";

const plugins = mode => {
    let plugins = [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin(),
        new ImageminPlugin({
            loader: mode === "production",
            bail: false,
            cache: true,
            filter: src => src.byteLength >= 8192,
            imageminOptions: {
                plugins: [
                    imageminGifsicle({
                        interlaced: true
                    }),
                    imageminJpegtran({
                        progressive: true
                    }),
                    imageminOptipng({
                        optimizationLevel: 5
                    }),
                    imageminSvgo({
                        //@ts-ignore
                        cleanupAttrs: true,
                        removeViewBox: true
                    })
                ]
            }
        }),
        new ForkTsCheckerWebpackPlugin({
            vue: true,
            formatter: "codeframe",
            checkSyntacticErrors: false
        }),
        new CaseSensitivePathsPlugin(),
        new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }])
    ];

    const createHtml = (template, filename, title = "WebVTT Editor (beta)") => {
        plugins = plugins.concat([
            new HtmlWebpackPlugin({
                template,
                filename,
                title,
                prod: mode === "production",
                minify:
                /* eslint-disable prettier/prettier */
                    mode === "production"
                        ? {
                            sortAttributes: true,
                            sortClassName: true,
                            collapseWhitespace: true
                        }
                        : false
                        /* eslint-enable */
            })
        ]);
    };

    createHtml("./src/index.ejs", "index.html");

    if (mode === "production") {
        plugins = plugins.concat([
            new webpack.optimize.AggressiveMergingPlugin()
        ]);
    }

    return plugins;
};

const resolve = mode => ({
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".vue", ".js"],
    alias: {
        "@": path.resolve(__dirname, "src"),
        vue:
            mode === "production"
                ? "vue/dist/vue.min.js"
                : "vue/dist/vue.esm.js"
    }
});

const optimization = mode => ({
    minimizer: [
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: mode === "development",
            terserOptions: {
                ecma: 7
            }
        }),
        new OptimizeCSSAssetsPlugin({})
    ]
});

const Renderer = (mode = "development") => ({
    mode,
    target: "electron-renderer",
    watch: mode === "development",
    entry: {
        index: ["./src/index.ts"]
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[name].bundle.js",
        jsonpFunction: "vendor",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                loader: "file-loader",
                options: {
                    name: "[path][sha1:hash:base64:64].[ext]"
                }
            },
            {
                test: /\/[^_]+?\.s[ac]ss$/,
                use: [
                    mode === "production"
                        ? "vue-style-loader"
                        : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            modules: false,
                            sourceMap: mode === "development"
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [
                                require("css-mqpacker")(),
                                require("postcss-preset-env")(),
                                require("css-declaration-sorter")({
                                    order: "smacss"
                                }),
                                require("cssnano")()
                            ],
                            sourceMap: mode === "development"
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            fiber: require("fibers"),
                            implementation: require("sass"),
                            indentedSyntax: true,
                            sourceMap: mode === "development"
                        }
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.(vue|(j|t)s)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: "eslint-loader",
                        options: {
                            failOnError: true,
                            fix: true,
                            quiet: true
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                exclude: [/node_modules/, /\.d\.ts$/],
                use: [
                    "babel-loader",
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            appendTsSuffixTo: [/\.vue$/],
                            happyPackMode: false
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    sortAttributes: mode === "production",
                    sortClassName: mode === "production",
                    collapseWhitespace: mode === "production"
                }
            }
        ]
    },
    resolve: resolve(mode),
    plugins: plugins(mode),
    devServer: {
        host: ip,
        hot: true,
        inline: true,
        port: 8080,
        progress: true,
        contentBase: path.resolve(__dirname, "src"),
        watchContentBase: true
    },
    devtool: mode === "production" ? "" : "inline-source-map",
    optimization: optimization(mode)
});

module.exports = Renderer;
