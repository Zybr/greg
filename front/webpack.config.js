const path     = require('path');
module.exports = {
    entry  : './public/javascripts/index.ts',
    module : {
        rules: [
            {
                test: /\.tsx?$/,
                use : 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
    output : {
        filename: 'index.js',
        path    : path.resolve(__dirname, 'dist')
    },
    mode   : 'development',
    devtool: "source-map"
};
