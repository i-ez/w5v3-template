const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const { VueLoaderPlugin } = require('vue-loader/dist/index')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(jpg|png|jpeg|gif|bmp)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:8].[ext]',
            outputPath: 'images/',
            limit: 10240,
          }
        }
      },
      {
        test: /\.(ttf|svg|eot|woff|woff2)$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsPlugin({
      // 运行成功
      compilationSuccessInfo: {
        message: ['App running at：\n -Local: http://localhost:1024'],
        notes: ['App running at：\n -Local: http://localhost:1024']
      },
      onErrors: (severity, errors) => {
        notifier.notify({
          title: 'webpack 编译失败了~',
          message: `${severity} ${errors[0].name}`,
          subtitle: errors[0].file || '',
          // icon,
        })
      },
      clearConsole: true,
    })
  ],
  stats: 'errors-warnings'
}
