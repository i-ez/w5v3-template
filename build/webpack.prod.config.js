const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../"
            }
          },
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../"
            }
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'W5V3',
      filename: 'index.html',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      minify: {
        // 压缩HTML文件
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true // 压缩内联css
      },
      cache: true
    }),
    // CSS文件压缩
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'), // OptimizeCSSAssetsPlugin插件默认也是使用cssnano
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      }
    }),
    // 提取单独CSS文件
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:6].css'
    }),
    new CleanWebpackPlugin()
  ]
}
