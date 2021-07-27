const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
	let envKeys = {};

	const resolvedEnv = argv.mode === 'development' ? dotenv.config().parsed : process.env;
	console.log(resolvedEnv);
	envKeys = Object.keys(resolvedEnv)
		.filter(key => key.indexOf('REACT_') === 0)
		.reduce((prev, next) => {
			prev[`process.env.${next.replace('REACT_', '')}`] = JSON.stringify(resolvedEnv[next]);
			return prev;
		}, {});
	console.log('envKeys', envKeys);
	// switch(argv.mode) {
	// 	case 'development':
	// 		console.log('pulling dev keys from dotenv');
	// 		const parsedEnv = dotenv.config().parsed;
		
	// 		envKeys = Object.keys(parsedEnv).reduce((prev, next) => {
	// 			prev[`process.env.${next}`] = JSON.stringify(parsedEnv[next]);
	// 			return prev;
	// 		}, {});
	// 		break;
	// 	case 'production':
	// 		console.log('pulling prod keys from Heroku config');
	// 		console.log(env);
	// 		console.log(process.env);
	// 		const clientKeys = ['TWITCH_CLIENT_ID'];
		
	// 		envKeys = clientKeys.reduce((prev, next) => {
	// 			prev[`process.env.${next}`] = env[next];
	// 			return prev;
	// 		}, {});
	// 		break;
	// }

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