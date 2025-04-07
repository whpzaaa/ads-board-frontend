const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081, // 前端开发服务器端口
    proxy: {
      '/api': {
        // 修改代理目标地址为正确的后端地址
        target: 'http://localhost:8080', 
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
});

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
    // 移除 another 入口配置
    // another: {
    //   entry: 'src/another.js',
    //   template: 'public/another.html',
    //   filename: 'another.html'
    // }
  }
};

// vue.config.js 示例
module.exports = {
  devServer: {
    proxy: {
      // 错误的代理配置可能导致请求地址被修改
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}