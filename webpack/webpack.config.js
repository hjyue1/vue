const path = require('path')
const configs = require('./base.config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extract = new ExtractTextPlugin('css/[name].[hash].css')
const autoprefixer = require('autoprefixer')({ browsers: ['last 2 version'] })
const IS_ENV = process.env.NODE_ENV == 'production'
const plugins = []
if (IS_ENV) {
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }))
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: true
    }))
}

module.exports = {
    target: 'web',
    entry: {
        main: ['babel-polyfill', './src/main.js']
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, `${configs.dest}static`),
        publicPath: configs.publicPath
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              use: ['babel-loader']
            },
            {
              test: /\.vue$/,
              use: [
                {
                  loader: 'vue-loader',
                  options: {
                    loaders: {
                      css: ExtractTextPlugin.extract({
                        use: ['css-loader'],
                        fallback: 'vue-style-loader'
                      }),
                      less: ExtractTextPlugin.extract({
                        use: ['css-loader', 'less-loader'],
                        fallback: 'vue-style-loader'
                      })
                    },
                    postcss: [autoprefixer]
                  }
                }
              ]
            },
            {
              test: /\.css$/,
              use: extract.extract([
                'css-loader'
              ])
            },
            {
              test: /\.less$/,
              use: extract.extract([
                'css-loader',
                'less-loader'
              ])
            },
            {
              test: /\.(eot|woff|svg|ttf|woff2|)(\?|$)/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: 'iconfont/[name].[hash].[ext]'
                  }
                }
              ]
            },
            {
              test: /\.(png|jpg|gif)$/,
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 2000,
                    name: 'images/[name].[hash].[ext]'
                  }
                }
              ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/template/index.html'),
            filename: '../index.html',
            title: configs.title,
            hash: true,
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true
          }
        }),
        extract
    ].concat(plugins),
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
            'configs$': path.resolve(__dirname, './base.config.js'), //程序的一些基本配置
            'util$': path.resolve(__dirname, '../src/util/index.js'), //常用工具方法
            'is-seeing$': path.resolve(__dirname, '../src/util/is-seeing.js'),
            'pull-list$': path.resolve(__dirname, '../src/mixins/pull-list.js'), //拉取列表
            'route-data$': path.resolve(__dirname, '../src/libs/route-data/index.js'), //页面数据缓存
            'stores': path.resolve(__dirname, '../src/stores/'), //常用工具方法
            'containers' :  path.resolve(__dirname, '../src/containers/'),
            'conponent' :  path.resolve(__dirname, '../src/conponent/'),
            'lesses' :  path.resolve(__dirname, '../src/lesses/')
        },
        extensions: ['.js', '.vue', '.json', '.less', '.css']
    }, 
    devtool: IS_ENV ? false : '#cheap-module-eval-source-map'
}