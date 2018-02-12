const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
});
