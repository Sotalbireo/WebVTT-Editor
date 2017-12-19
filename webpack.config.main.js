const path = require('path')
const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')
const ExternalsPlugin = webpack.ExternalsPlugin

const webpackConfig = {
    target: 'electron-main',
    node: {
        __dirname: false
    },

    entry: {
        app: './src/main/app.ts'
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
        }]
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        jsonpFunction: 'vendor'
    },
    plugins: [
        new CheckerPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: Infinity
        })
    ],
    resolve: {
        modules: [
            path.resolve('src'),
            'node_modules'
        ],
        extensions: [".tsx", ".ts", ".js", ".jsx"]
    },

    devServer: {
        port: 8000,
        progress: true
    }
}

module.exports = webpackConfig
