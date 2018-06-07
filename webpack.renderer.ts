import * as path from 'path';
import * as webpack from 'webpack';



const tsLoader = [
	'awesome-typescript-loader',
	{
		loader: 'tslint-loader',
		options: {
			configFile: 'tslint.json',
			fix: true,
			tsConfigFile: 'tsconfig.json',
			typeCheck: true
		}
	}
];

const sassLoader = [
	'style-loader',
	{
		loader: 'css-loader',
		options: {
			minimize: true,
			sourceMap: true
		}
	},
	'sass-loader'
];

const plugins = () => {
	let plugin = [];

	return plugin;
}

const config = {
	entry: {
		index: './src/renderer/index.ts'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		jsonpFunction: 'vendor'
	},
	target: 'electron-renderer',
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: tsLoader,
			exclude: /node_modules/
		},
		{
			test: /\.sass$/,
			use: sassLoader
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
	node: {
		__dirname: false
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
