const path       = require('path');
const srcJsPath  = './src/init/';
const distJsPath = path.resolve(__dirname, 'dist/javascript');

module.exports = {
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
    entry  : {
        search: srcJsPath + 'search.tsx',
        main: srcJsPath + 'main.tsx',
    },
    output : {
        path             : distJsPath,
        filename         : '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    mode   : 'development',
    devtool: "source-map",
};
