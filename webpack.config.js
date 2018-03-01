'use strict'

var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

var ENV = process.env.NODE_ENV || 'development'
var isDev = ENV === 'development'
var isPro = ENV === 'production'
var port = 4000

function resolve (dir) {
  return path.join(__dirname, dir)
}

function cssLoaders (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextWebpackPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

module.exports = {
  entry: {
    app: [resolve('./polyfill.js'), resolve('src/main.js')],
    vendor: ['vue', 'vue-router', 'axios']
  },
  output: {
    path: resolve('dist'),
    filename: isPro ? 'static/js/[name].[chunkhash:8].js' : 'static/js/[name].js',
    chunkFilename: isPro ? 'static/js/[name].[chunkhash:8].chunk.js' : 'static/js/[name].chunk.js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      'vue$': 'vue/dist/vue.common.js',
      'vueRouter$': 'vue-router/dist/vue-router.js'
    },
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        include: resolve('src'),
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          formatter: require('eslint-friendly-formatter'),
          fix: true
        }
      },
      {
        test: /\.(js)$/,
        include: resolve('src'),
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: cssLoaders({
            sourceMap: true,
            extract: !isDev
          }),
          postcss: [autoprefixer({ browsers: ['> 1%', 'last 10 versions'] })]
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize=true&&importLoaders=1', 'postcss-loader']
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize=true', 'postcss-loader', 'less-loader']
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize=true', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: isPro ? 'static/media/[name].[hash:8].[ext]' : 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.(ttf|woff|eot|svg)(\??.*)$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: isPro ? 'static/media/[name].[hash:8].[ext]' : 'static/media/[name].[ext]'
        }
      }
    ]
  },

  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor'
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('./index.html'),
      // favicon: resolve('./favicon.ico'),
      alwaysWriteToDisk: true,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: isPro,
        minifyCSS: isPro,
        minifyURLs: isPro
      }
    }),
    new ExtractTextWebpackPlugin({
      filename: isPro ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css'
    }),
    new webpack.DefinePlugin({ // 你可以理解为，通过配置了 DefinePlugin，那么这里面的标识就相当于全局变量，你的业务代码可以直接使用配置的标识。
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin({ // 根据模块的相对路径生成一个长度只有四位的字符串作为模块的 id
      hashFunction: 'md5',
      hashDigest: 'base64',
      hashDigestLength: 4
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
      minSize: 0,                // 最小尺寸，默认0
      minChunks: 1,              // 最小 chunk ，默认1
      maxAsyncRequests: 1,       // 最大异步请求数， 默认1
      maxInitialRequests: 1,    // 最大初始化请求书，默认1
      name: () => {},              // 名称，此选项课接收 function
      cacheGroups: {                 // 这里开始设置缓存的 chunks
        priority: "0",                // 缓存组优先级 false | object |
        vendor: {                   // key 为entry中定义的 入口名称
          chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          test: /vue|vue-router|axios/,     // 正则规则验证，如果符合就提取 chunk
          name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
          minSize: 0,
          minChunks: 1,
          enforce: true,
          maxAsyncRequests: 1,       // 最大异步请求数， 默认1
          maxInitialRequests: 1,    // 最大初始化请求书，默认1
          reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
        }
      }
    }
  },
  devtool: isPro ? '' : 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: port,
    disableHostCheck: true,
    historyApiFallback: true, // 单页面时，不跳转，
    hot: true,
    inline: true,
    progress: true
  }
}
if (isDev) {
  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin() // 热加载插件
  )
} else if (isPro) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false
      }
    })
  )
}
