'use strict';
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  dev: {
    env: require('./dev.env'),
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/oa': {
        // target: 'http://192.168.12.81:8081/OA',//开发环境（徐冰阳）
        target: 'http://192.168.12.4:8089/OA', //开发环境（万雄波）
        // target: 'http://192.168.12.37:8080/OA', //开发环境（张江浩）
        // target: 'http://192.168.12.79:8080/OA',//开发环境（黄凯）
        // target: 'http://192.168.27.147:8088/OA',//开发环境（万雄波笔记本）
        // target: 'http://192.168.12.134:8081/OA', //开发环境（向高熊）

        // target: 'http://192.168.0.202:8158/OA',//内网环境
        // target: 'http://120.31.131.193:8104/OA',//测试环境193
        // target: 'https://webtest1.sijibao.com/OA',//测试环境 阿里
        // target: 'http://webtest.sijibao.com/OA',//测试环境 阿里
        // target: 'http://web.sijibao.co/OA', //测试环境 新地址

        // target: 'https://oa.sijibao.com/OA', //正式环境
        changeOrigin: true,
        pathRewrite: {
          '^/oa': ''
        }
      }
    },

    // Various Dev Server settings
    host: '192.168.12.10', // can be overwritten by process.env.HOST
    port: 7777, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './', //不改是域名下的根目录 比如：http://www.abc.com/static/xxx

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
