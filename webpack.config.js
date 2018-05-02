const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry : __dirname + '/src/index.js',
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : /node_modules/,
                loader : 'babel-loader'
            },
            {
                test: /\.s?css$/,
                use : ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    output : {
        path: __dirname + '/dist',
        filename : 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
                 'process.env.NODE_ENV': '"production"'
        }),
        new BundleAnalyzerPlugin(),
        new UglifyJsPlugin()
    ]
}