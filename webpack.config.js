const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [`style-loader`, `css-loader`],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `src/index.html`
    }),
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`]
    })
  ],
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080`,
    compress: true,
    watchContentBase: true
  }
};
