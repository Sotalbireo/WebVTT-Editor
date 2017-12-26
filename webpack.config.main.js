const path = require('path')
const webpack = require('webpack')
const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
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
            use: 'awesome-typescript-loader?{configFileName:"tsconfig.main.json"}',
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
        }),
        new UglifyJSPlugin({
            ecma: 8,
            parallel: true
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
