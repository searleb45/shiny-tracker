const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

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
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
			new CopyPlugin({
				patterns: [
					{
						from: path.join(__dirname, 'src/client/static'),
						to: path.join(__dirname, 'build'),
						filter: (path) => path.match(/(boxart|sprites|\.html$)/)
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