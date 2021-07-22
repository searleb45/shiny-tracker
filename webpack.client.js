const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
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
				{ from: path.join(__dirname, 'src/client/static'), to: path.join(__dirname, 'build') }
			]
		})
	],
	resolve: {
		extensions: ['.js', '.jsx']
	}
};