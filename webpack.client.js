const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const sharp = require('sharp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = (env, argv) => {
	let envKeys = {};

	const resolvedEnv = argv.mode === 'development' ? dotenv.config().parsed : process.env;
	envKeys = Object.keys(resolvedEnv)
		.filter(key => key.indexOf('REACT_') === 0)
		.reduce((prev, next) => {
			prev[`process.env.${next.replace('REACT_', '')}`] = JSON.stringify(resolvedEnv[next]);
			return prev;
		}, {});

	return {
		entry: './src/client/index.js',
		output: {
			filename: '[name].[contenthash].js',
			chunkFilename: '[chunkhash].js',
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
							['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
						],
						plugins: ['@babel/transform-runtime']
					},
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
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
					type: 'asset/resource'
				},
				{
					test: /\.svg$/,
					oneOf: [
						{
							resourceQuery: /react/,
							loader: 'react-svg-loader'
						},
						{
							type: 'asset/inline'
						}
					]
				}
			]
		},

		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].[hash].css',
				chunkFilename: '[chunkhash].css',
			}),
			new CopyPlugin({
				patterns: [
					{
						from: path.join(__dirname, 'src/client/static/boxart'),
						to: path.join(__dirname, 'build/boxart'),
						transform: (content) => sharp(content).resize(200).toBuffer()
					},
					{
						from: path.join(__dirname, 'src/client/static/sprites'),
						to: path.join(__dirname, 'build/sprites'),
					},
					{
						from: path.join(__dirname, 'src/client/static/favicon.ico'),
						to: path.join(__dirname, 'build')
					}
				]
			}),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, 'src/client/index.html')
			}),
			new webpack.DefinePlugin(envKeys),
			new GenerateSW({
				skipWaiting: true,
				exclude: [/sprites\/.*/],
				navigateFallback: 'index.html',
				runtimeCaching: [
					{
						urlPattern: /\/(boxart|sprites)\/.*/,
						handler: 'CacheFirst'
					},
					{
						urlPattern: /\.(css|js)/,
						handler: 'CacheFirst'
					},
					{
						urlPattern: /\/api\/.*/,
						method: 'GET',
						handler: 'NetworkFirst'
					},
					{
						urlPattern: /\/api\/.*/,
						method: 'PUT',
						handler: 'NetworkOnly',
						options: {
							backgroundSync: {
								name: 'hunt-update-sync'
							}
						}
					}
				]
			})
		],
		resolve: {
			extensions: ['.js', '.jsx']
		}
	};
};