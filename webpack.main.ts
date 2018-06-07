import * as path from 'path';
import * as webpack from 'webpack';

const plugins = () => {
    return [];
}

const config = {
    target: 'electron-main',
    node: {
        __dirname: false
    },

    entry: {
        app: './src/main/app.ts'
    },

    module: {
        rules: [
            {
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader?{configFileName:"tsconfig.main.json"}',
            exclude: /node_modules/
            }
        ]
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        jsonpFunction: 'vendor'
    },
    plugins: plugins(),
    resolve: {
        modules: [
            path.resolve('src'),
            'node_modules'
        ],
        extensions: ['*', '.tsx', '.ts']
    }
}
export default config
