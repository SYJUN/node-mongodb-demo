// import express from 'express';
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')
var _ = require('lodash');

var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var Movie = require('./models/movie');
var User = require('./models/user');
var dbUrl = 'mongodb://127.0.0.1:27017/movies';

// 使用原生 Promise 替换 mongoose 的 Promise
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, { useMongoClient: true });

// process 全局变量
var port = process.env.PORT || 3100;
var app = express();

var dir = path.join(__dirname, './views/pages/');

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
    // resave: false,
    // saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

app.use(bodyParser.urlencoded());
/*通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
注意：express 4.x版本之后值保留了express.static这个方法，其他方法都分为中间件另外安装引入
*/
app.use(express.static(path.join(__dirname, 'public')));


// 会话持久逻辑预处理
app.use(function(req, res, next) {
    var _user = req.session.user;

    if (_user) {
        app.locals.user = _user;
    }

    return next();
});

// 首页
app.get('/', function(req, res) {
    console.log('user in session: ')
    console.log(req.session.user)

    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: '电影网站首页',
            movies: movies
        });
    });
});

// 详情页
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie) {

        if (err) {
            console.log(err);
        }

        res.render('detail', {
            title: movie.title,
            movie: movie
        });
    })
});

// 后台录入页
app.get('/admin/new', function(req, res) {
    res.render('admin', {
        title: '电影录入',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

// 更新电影信息
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }

            res.render('admin', {
                title: '后台更新页',
                movie: movie
            });
        });
    }
});

// 添加新电影的 API post
app.post('/admin/new', function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    // 更新
    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }

            // 用新字段替换掉原来的字段
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }

                // 重定向到当前 id 的详情页
                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        // 新添加一条数据
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });

        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        })

    }
});

// 列表页
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: '电影列表',
            movies: movies
        });
    });
});

// 列表页删除 API
app.delete('/admin/list', function(req, res) {
    var id = req.query.id;

    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1
                });
            }
        });
    }
});


/**
 * user router
 */
// signup
app.post('/user/signup', function(req, res) {
    var _user = req.body.user;

    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            return res.redirect('/');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                console.log(user)
            });

            res.redirect('/admin/userlist');
        }
    });
});

// 用户列表页
app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }

        res.render('userlist', {
            title: '用户列表',
            users: users
        });
    });
});

// 登录
app.post('/user/signin', function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({ name: name }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (!user) {
            res.redirect('/');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                // 登录成功
                console.log('Password is matched')
                req.session.user = user;
                return res.redirect('/');
            } else {
                console.log('Password is not matched');
                return res.redirect('/');
            }
        });
    });
});

// 退出
app.get('/logout', function(req, res) {
    delete req.session.user;
    delete app.locals.user;

    res.redirect('/');
})


app.listen(port);

console.log('Server is running at http://localhost:' + port + '/')