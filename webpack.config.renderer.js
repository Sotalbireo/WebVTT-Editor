const path = require('path')
const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')
const ExternalsPlugin = webpack.ExternalsPlugin

const webpackConfig = {
    target: 'electron-renderer',
    node: {
        __dirname: false
    },

    entry: {
        index: './src/renderer/index.ts'
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: 'file-loader?name=[name].[ext]'
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: 'file-loader'
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
