module.exports = {
    entry: [
        './App/index.js'
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/wwwroot/dist',
        publicPath: '/dist/',
        filename: 'bundle.js'
    }
};