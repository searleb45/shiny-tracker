const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
	let envKeys = {};
	if(argv.mode === 'development') {
		const parsedEnv = dotenv.config().parsed;
	
		envKeys = Object.keys(parsedEnv).reduce((prev, next) => {
			prev[`process.env.${next}`] = JSON.stringify(parsedEnv[next]);
			return prev;
		}, {})
	}
	return {
		entry: './src/client/index.js',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'build')
		},
		module: {
			rules: [
				{
					test: /\.js(x)?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					options: {
						presets: [
							'@babel/preset-react',
							['@babel/env', { targets: { browsers: ['last 2 versions'] } }],
						],
					},
				},
				{
					test: /\.(s)?css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'resolve-url-loader',
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				},
				{
					test: /\.(png|jpg|jpeg|gif)$/,
					loader: 'file-loader'
				}
			]
		},

		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
			new CopyPlugin({
				patterns: [
					{
						from: path.join(__dirname, 'src/client/static'),
						to: path.join(__dirname, 'build'),
						filter: (path) => path.match(/\.html$/)
					}
				]
			}),
			new webpack.DefinePlugin(envKeys)
		],
		resolve: {
			extensions: ['.js', '.jsx']
		}
	};
};