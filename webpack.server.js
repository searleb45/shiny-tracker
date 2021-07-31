const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
	let envKeys = {};

	const resolvedEnv = argv.mode === 'development' ? dotenv.config().parsed : process.env;
	envKeys = Object.keys(resolvedEnv)
		.filter(key => key.indexOf('REACT_') === -1)
		.reduce((prev, next) => {
			prev[`process.env.${next}`] = JSON.stringify(resolvedEnv[next]);
			return prev;
		}, {});

	return {
		entry: './src/server/index.js',
		output: {
			filename: 'server-bundle.js',
			path: path.resolve(__dirname, 'build')
		},
		target: 'node',
		externals: [nodeExternals()],
		module: {
			rules: [
				{
					test: /\.js(x)?$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin(envKeys)
		],
	}
};