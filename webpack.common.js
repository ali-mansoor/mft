const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const purgePath = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
};

module.exports = {
  entry: {
    index: `${purgePath.src}/index.ts`,
  },
  output: {
    filename: "[name].[contenthash].js",
    path: purgePath.dist,
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: purgePath.src,
        exclude: `${purgePath.src}/node_modules`,
        use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            }
          ],
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        type: "asset/resource",
      },    
    ]
  },
  plugins: [
    new ESLintPlugin({
        extensions: ['.tsx', '.ts', '.js'],
        exclude: 'node_modules',
        context: 'src',
        fix: true,
     }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: "index.html",
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
