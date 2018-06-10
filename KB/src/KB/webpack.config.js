
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: '../vs',
            }
        ])
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/wwwroot/dist',
        publicPath: '/dist/',
        filename: 'bundle.js'
    }
};