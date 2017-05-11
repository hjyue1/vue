const express = require('express')
const proxy = require('http-proxy-middleware');//引入代理中间件
const path = require('path')
const mkdirp = require('mkdirp');
const cp = require('cp');

mkdirp.sync(path.resolve(__dirname, './dist/'))
cp.sync(path.resolve(__dirname, './config.js'), path.resolve(__dirname, './dist/config.js'))

const app = express()

const distPath = path.join(__dirname, './dist/')
console.log(distPath)

app.use("/", express.static(distPath));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3001, (err) => {
    if (err) return console.log(err)
    console.log('filesever run :http://localhost:3001/')
})