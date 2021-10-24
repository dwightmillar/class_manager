const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  entry: {
    index: "./src/index.js"
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    clean: true,
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    minimizer: isProduction ? [new TerserPlugin()] : [],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    }
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 4001,
    compress: true,
    publicPath: '/',
    historyApiFallback: true,
    watchFiles: ['src'],
    proxy: {
      '/api': `http://localhost:4000`
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

    // new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  return config;
};
