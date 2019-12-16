const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.[contenthash].js`,
    path: path.join(__dirname, `public`)
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `./public/index.html`
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
