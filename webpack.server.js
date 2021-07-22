const path = require('path');

module.exports = {
	entry: './src/server/index.js',
	output: {
		filename: 'server-bundle.js',
		path: path.resolve(__dirname, 'build')
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.js(x)?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	}
};