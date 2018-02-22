const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                },
                exclude: /node_modules/,
            }
        ],
        loaders: [
            { test: /\.json$/, loader: 'json-loader' }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'index.js',
        library: "boxrec",
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, 'dist')
    },
    target: "node"
};
