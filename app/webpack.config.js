const webpack = require("webpack")
const path = require('path');

module.exports = {
    plugins: [new webpack.IgnorePlugin(/pg-native/, /\/pg\//, /sequelize/, /mariadb/, /mysql2/, /sqlite3/)],
    module: {
        rules: [
            {
                test: /\.js$/,
                // include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                // exclude: /(node_modules|build)/,

            },
        ],
    },
    target: 'node',
    node: {
        __dirname: false,
    },
    resolve: {
        alias: {
            mysql: path.resolve(__dirname, "empty_module"),
            mysql2: path.resolve(__dirname, "empty_module"),
            sqlite3: path.resolve(__dirname, "empty_module"),
            tedious: path.resolve(__dirname, "empty_module"),
            mariadb: path.resolve(__dirname, "empty_module"),
        },
    }
};