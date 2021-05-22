const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "./"),
    publicPath: "/",
    hot: true
  },
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  esmodules: true,
                },
              },
              '@babel/preset-react'
            ],
          ],
          plugins: ['@babel/plugin-transform-runtime']
        }
      },
      {
        // config for sass compilation
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
        ]
      },
      {
        // config for images
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images"
            }
          }
        ]
      },
      {
        // config for fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      title: "Buckets"
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "css/*.*",
        "js/*.*",
        "fonts/*.*",
        "images/*.*"
      ]
    })
  ]
};