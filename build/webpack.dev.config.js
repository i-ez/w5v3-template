const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
    ]
  },
  devtool: 'eval-cheap-module-source-map',// webpack5 修改了校验规则
  devServer: {
    hot: true,
    open: true,
    port: 1024,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'W5V3',
      template: './public/index.html'
    }),
  ]
}
