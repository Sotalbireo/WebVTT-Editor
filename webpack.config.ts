import { resolve } from 'path'
import webpack from 'webpack'

const config: webpack.Configuration = {
  target: 'electron-main',
  entry: './src/server/index.ts',
  output: {
    path: resolve(__dirname, 'dist', 'server'),
    filename: 'index.js'
  },
  module: {
    rules: [
      // {
      //   test: /\.ts$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/,
      //   options: {
      //     configFile: 'tsconfig.main.json'
      //   }
      // }
      {
        test: /\.(ts|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules']
  },
  plugins: []
}

export default config
