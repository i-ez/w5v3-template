# webpack5+Vue3 开发环境搭建

## 新建项目文件夹并初始化 git 仓库

```
md w5v3 && cd w5v3
git init
```

## 安装 webpack

```
yarn add -D webpack webpack-cli webpack-merge
```

### 为 webpack 配置不同模式的配置文件

在项目根目录 build 文件夹，在其中创建 webpack.base.config.js、webpack.dev.config.js、webpack.prod.config.js 三个文件。

> webpack.base.config.js 存放公用配置代码

```
// webpack.base.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist')
  }
}
```

在项目根目录新建 src 文件夹，并在 src 内创建 index.js 项目入口文件

> webapck.dev.config.js 存放开发环境配置代码

```
// webapck.dev.config.js
module.exports = {
  mode: 'development',
}
```

> webapck.prod.config.js 存放生产环境打包配置代码

```
// webapck.prod.config.js
module.exports = {
  mode: 'production',
}
```

### 整合配置文件

在根目录新建 webpack.config.js 文件，整合 build 文件夹中的三个配置文件

```
// webpack.config.js
const { merge } = require('webpack-merge')
const baseConfig = require('./build/webpack.base.config')
const devConfig = require('./build/webpack.dev.config')
const proConfig = require('./build/webpack.prod.config')

let config = process.env.NODE_ENV === 'development' ? devConfig : proConfig

module.exports = merge(baseConfig, config)
```

## 安装 cross-env

```
yarn add -D cross-env
```

修改 package.json，添加 build 脚本

```
"scripts": {
  "build": "cross-env NODE_ENV=production webpack",
}
```

## 打包文件清理

由于打包的文件加了 hash，每次打包生成的文件都会 dist 目录保留，安装并配置 clean-webpack-plugin 插件帮助我们每次打包前先清除以前的打包文件。

```
yarn add -D clean-webpack-plugin
```

修改 webpack.prod.config.js

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

......
plugins: [
  new CleanWebpackPlugin()
]
```

## ES6 转换 ES5

如果项目不需要转换到 ES5，可以使用 esbuild 替代 babel-loader

安装 babel-loader

```
yarn add -D @babel/core @babel/preset-env babel-loader
```

修改 webpack.base.config.js

```
...
module: {
  rules: [
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
  ]
}
...
```

## 解析字体、图片资源

```
yarn add -D url-loader
```

修改 webpack.base.config.js

```
rules: [
  ...
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
```

## 开启 source-map

通常我们希望开发时开启 source map 功能，方便代码报错排查，而生产环境打包出的代码关闭 source map 功能，避免暴露源码，所以只在 webpack.dev.config.js 中开启 devtool 设置 source map

```
// webpack.dev.config.js
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',// webpack5 修改了校验规则
}
```

> 注意：webpack5 修改了 devtool 的正则校验规则，webpack4 的方案在 webpack5 中会报错

## 创建 HTML 文件模板

在项目根目录下创建 public 文件夹，并在其中创建 index.html 模板文件并写入如下内容：

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>
        We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work
        properly without JavaScript enabled. Please enable it to continue.
      </strong>
    </noscript>
    <div id="app"></div>
  </body>
</html>
```

为了把打包好的 js 文件自动插入到 html 模板文件中，需要安装 html-webpack-plugin 插件

```
yarn add -D html-webpack-plugin
```

修改 webpack.dev.config.js 文件，添加 plugins 配置项

```
// webpack.dev.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

......
plugins: [
  new HtmlWebpackPlugin({
    title: 'W5V3',
    template: './public/index.html'
  }),
]
```

修改 webpack.prod.config.js 文件，同样添加 plugins 配置项

> 注意：对于生产环境的配置，开启了 HTML 文件压缩

```
// webpack.prod.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

......
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
]
```

## 安装 webpack-dev-server，配置开发服务器

```
yarn add -D webpack-dev-server@4
```

修改 webpack.dev.config.js，添加 devServer 配置

```
// webpack.dev.config.js
  devServer: {
    hot: true,
    open: true,
    port: 1024,
  },
```

修改 package.json 文件 scripts 项，添加 serve 命令脚本

```
// package.json
"scripts": {
  "serve": "cross-env NODE_ENV=development webpack serve",
  "build": "cross-env NODE_ENV=production webpack",
}
```

## 解析 Less、CSS 文件

安装以下依赖

```
yarn add -D less less-loader postcss postcss-loader css-loader style-loader
```

对于 css 样式的解析，开发环境和生产环境的要求略有不同：

- 开发环境配置倾向于快速解析资源，快速构建；
- 生产环境配置要求 css 代码 tree shaking、代码压缩并提取独立文件。

修改 webpack.dev.config.js 文件，添加以下配置

```
// webpack.dev.config.js
...
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
...
```

开发环境下，经过层层处理的 css 样式代码，会被 style-loader 用\<style>标签插入到 HTML 文件的头部\<head>标签内。

生产环境因为需要压缩并提取单独的 css 文件，所以不使用 style-loader，这里需要安装 optimize-css-assets-webpack-plugin 插件进行 css 代码压缩，安装 mini-css-extract-plugin 插件进行 css 代码提取

```
yarn add -D optimize-css-assets-webpack-plugin mini-css-extract-plugin
```

修改 webpack.prod.config.js 文件

```
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
```

> 注意：webpack5 移除了 compiler.plugin API，导致 purifycss-webpack 无法使用，所以这里暂时不针对 CSS 资源做 tree shaking 配置

## 配置 postcss

针对 css 资源，开发与生产配置都使用了 postcss-loader，我们希望通过 postcss 对 css 代码进行规范化处理，这里需要用到 autoprefixer 插件

```
yarn add -D autoprefixer
```

项目根目录下新建 postcss.config.js 文件，写入如下内容

```
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 2 versions', '>1%']
    }),
    // require('cssnano')
  ]
}
```

## 配置 js 代码 tree shaking 与 js 代码压缩

到目前为止，生产环境的 webpack 配置已经具备以下功能：

1. HTML 文件压缩
2. CSS 和 Less 资源转换、规范化、tree shaking、提取单独文件、代码压缩

还缺少对 JS 文件的压缩处理。安装 js 代码压缩插件 terser-webpack-plugin

```
yarn add -D terser-webpack-plugin
```

修改 webpack.prod.config.js，添加 optimization 项

```
// webpack.prod.config.js
const TerserWebpackPlugin = require('terser-webpack-plugin')

......
optimization: {
  usedExports: true,
  // 压缩js代码
  minimize: true,
  minimizer: [
    new TerserWebpackPlugin()
  ]
},
```

usedExports: true, 开启了 js 代码 tree shaking，为了避免 tree shaking 过程中删除文件中引入的 .less、.css 文件，需要修改 package.json 文件，加入 sideEffects 项

```
"sideEffects": [
  "*.less",
  "*.css"
],
```

## 识别 .vue 文件

安装依赖

```
yarn add vue@next
yarn add -D vue-loader@next @vue/compiler-sfc
```

修改 webpack.base.config.js

```
const { VueLoaderPlugin } = require('vue-loader/dist/index');

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

在 src 文件夹中新建 App.vue 文件

```
// App.vue
<template>
  <div>
    <h1>webpack5+Vue3</h1>
    <p>{{name}}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const name = ref("解析Vue文件");

    return {
      name,
    };
  },
});
</script>
```

修改 index.js 文件

```
// index.js
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app')
```

## 优化

### 打包友好提示

> webpack-dev-server4 现在还处于 beta 阶段，[clientLogLevel](https://www.webpackjs.com/configuration/dev-server/#devserver-clientloglevel) 属性可以在开发阶段控制 console 输出，但现在该功能还未实现。

使用 friendly-errors-webpack-plugin 插件配合 stats：'errors-warnings'，去除每次打包控制台不必要的输出，只在有错误和警告时输出信息。node-notifier 会把错误信息投屏到浏览器。

安装依赖

```
yarn add -D friendly-errors-webpack-plugin node-notifier
```

修改 webpack.base.config.js

```
// webpack.base.config.js
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')

// ......
  plugins: [
    new VueLoaderPlugin(),
+   new FriendlyErrorsPlugin({
+     onErrors: (severity, errors) => {
+       notifier.notify({
+         title: 'webpack 编译失败了~',
+         message: `${severity} ${errors[0].name}`,
+         subtitle: errors[0].file || '',
+         icon,
+       })
+     },
+   })
  ],
+ stats: 'errors-warnings'
```

### 配置 eslint

项目中一般不用配置 eslint，因为 vscode 编辑器中有提供 eslint 插件，下载一下插件，就可以自动根剧 vscode 的配置文件检测。但是 vscode 是一个编辑器，里面的插件只是一些在你编辑代码的时候辅助的工具，而 vscode 中的 eslint 的插件是辅助你规范代码编写的，它只会提示你，而对你的程序不会有什么影响。

webpack 静态模块打包器(module bundler)，如果你在其中使用 eslint 插件的时候，如果没有按照其中的规范写的话，会停止编译，你打开浏览器查看 console 是会提示你的，它是实实在在对你地程序是有影响的。

为了规范团队成员代码风格，安装 eslint-webpack-plugin （官方推荐使用 eslint-webpack-plugin 替代 eslint-loader，eslint-loader 将废弃）

```
yarn add -D eslint eslint-plugin-vue eslint-webpack-plugin
```

修改 webpack.dev.config.js

```
// webpack.base.config.js
const ESLintPlugin = require('eslint-webpack-plugin')

// ......
plugins: [
    new VueLoaderPlugin(),
+   new ESLintPlugin(),
]
```

根目录新建 .eslintrc.js 文件

```
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Vue2使用此项配置
  ],
  "env": {
    "browser": true, //
    "node": true //
  },
  // ！！！！如果没使用alias下面的不用配置！！！！！
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js'
      }
    }
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
```

> 注意：如果 webpack 中配置了 alias 并且在 import 时使用了别名，则需要额外安装 eslint-import-resolver-webpack

新建 .eslintignore 文件

```
build
dist
node_modules
public
src/assets
src/icons
```

### EditorConfig

根目录新建 .editorconfig 文件

```
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```
