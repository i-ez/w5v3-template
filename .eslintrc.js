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
