const path = require("path");
const { merge } = require('webpack-merge');
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');
const PurgeCss = require("purgecss-webpack-plugin");
const glob = require("glob");

const domain = process.env.PRODUCTION_DOMAIN;

const purgePath = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
};

const prodConfig = {
  mode: 'production',
  output: {
    publicPath: '/container/latest/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'API_URL': JSON.stringify('http://localhost:8080/bands')
      }
    }),
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        dashboard: `dashboard@${domain}/dashboard/latest/remoteEntry.js`,
        admin: `admin@${domain}/admin/latest/remoteEntry.js`
      },
      shared: packageJson.dependencies,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${purgePath.src}"assets/images/*`,
          to: purgePath.dist,
          context: "src",
        },
      ],
    }),
    new PurgeCss({
      paths: glob.sync(`${purgePath.src}/**/*`, { nodir: true }),
      safelist: ["dummy-css"],
    }),
    new MiniCssExtractPlugin()
  ],
};

module.exports = merge(commonConfig, prodConfig);
