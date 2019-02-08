const path = require('path');

function srcPath(subdir) {
    return path.join(__dirname, "src", subdir);
}

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
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            "@helpers": srcPath("helpers.ts"),
            "@boxrec-pages": srcPath("boxrec-pages"),
            "@boxrec-common-tables": srcPath("boxrec-common-tables"),
            "@boxrec-constants": srcPath("boxrec.constants")
        }
    },
    output: {
        filename: 'index.js',
        library: "boxrec",
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, 'dist')
    },
    target: "node"
};
