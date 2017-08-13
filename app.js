// import express from 'express';
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// express.logger 在express 4.0后已经迁出，现在为morgan
var morgan = require('morgan');


var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://127.0.0.1:27017/movies';

// 使用原生 Promise 替换 mongoose 的 Promise
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, { useMongoClient: true });

// process 全局变量
var port = process.env.PORT || 3100;
var app = express();

var dir = path.join(__dirname, './app/views/pages/');

// 引用 moment,存入本地全局变量中，方便项目中调用
app.locals.moment = require('moment');

// 使用html模板，需增加  app.engine('html', require('ejs').__express);使用EJS或jade模板，不用配置该项。
// 设置模板相对路径(相对当前目录)
app.set('views', dir);
// 设置模板引擎
app.set('view engine', 'jade');

// 引用存储，用来保存用户登录状态
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

app.use(bodyParser.urlencoded({ extended: true }));
/*通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
注意：express 4.x版本之后值保留了express.static这个方法，其他方法都分为中间件另外安装引入
*/
app.use(express.static(path.join(__dirname, 'public')));

// 如果为开发环境，则做以下配置
if (app.get('env') === 'development') {
    app.set('showStackError', true);
    // app.use(express.logger(':method :url :status'));
    app.use(morgan(':method :url :status'));
    // 本地编译后源码格式化显示
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/router')(app);

app.listen(port);

console.log('Server is running at http://localhost:' + port + '/')