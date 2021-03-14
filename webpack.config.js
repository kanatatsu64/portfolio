const nodeExternals = require('webpack-node-externals')

module.exports = {
    mode: 'development',
    entry: './index.js',
    externals: [nodeExternals()],
    resolve: {
        modules: [
            __dirname,
            'node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    target: 'node'
}
