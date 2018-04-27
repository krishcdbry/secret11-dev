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
    }
}