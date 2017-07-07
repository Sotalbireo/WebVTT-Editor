const path = require('path')

const webpackConfig = {
    target: 'web',

    entry: './src/index.tsx',

    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
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
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'assets'),
        publicPath: './assets/'
    },
    resolve: {
        modules: [
            path.resolve('src'),
            'node_modules'
        ],
        extensions: [".tsx", ".ts", ".js"]
    },
}

module.exports = webpackConfig
