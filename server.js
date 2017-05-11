const configs = require('./webpack/base.config')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack/webpack.config')
const proxy = require('http-proxy-middleware');//引入代理中间件



const app = express()
const compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: 'minimal'
})
const apiProxy = proxy('/config.js', { target: 'http://localhost:3001',changeOrigin: true });//将服务器代理到localhost:8080端口上[本地服务器为localhost:3000]
app.use('/config.js', apiProxy);//config.js用代理

app.use(require('connect-history-api-fallback')({
    index: `${configs.publicPath}../index.html`
}))
app.use(devMiddleware)

app.listen(3000, (err) => {
    if (err) return console.log(err)
    console.log('http://localhost:3000/')
})