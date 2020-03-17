const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: ['./sandbox/index.html', './sandbox/index.ts'],
	resolve: {
		extensions: ['.ts', '.js']
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist/bundle'),
		publicPath: '/',
		port: 8000
	},
	output: {
		filename: 'bundle.js',
		publicPath: '/',
		path: path.join(__dirname, 'dist/bundle')
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'awesome-typescript-loader'
				}
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'sandbox/index.html'
		})
	]
};
