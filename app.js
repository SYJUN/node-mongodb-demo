// import express from 'express';
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const _ = require('lodash');

const mongoose = require('mongoose');
const Movie = require('./models/movie');

mongoose.connect('mongodb://127.0.0.1:27017/movie', { useMongoClient: true });

// process 全局变量
const port = process.env.PORT || 3000;
const app = express();

const dir = path.join(__dirname, './views/pages/');

// 引用 moment,存入本地全局变量中，方便项目中调用
app.locals.moment = require('moment');

// 使用html模板，需增加  app.engine('html', require('ejs').__express);使用EJS或jade模板，不用配置该项。
// 设置模板相对路径(相对当前目录)
app.set('views', dir);
// 设置模板引擎
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
/*通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
注意：express 4.x版本之后值保留了express.static这个方法，其他方法都分为中间件另外安装引入
*/
app.use(express.static(path.join(__dirname, 'bower_components')));



// 首页 分割线
app.get('/', function(req, res) {
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
    const id = req.params.id;

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
app.get('/admin/movie', function(req, res) {
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

// admin update movie
app.get('/admin/update/:id', function(req, res) {
    const id = req.params.id;

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

// admin post movie
app.get('/admin/movie/new', function(req, res) {
    const id = req.body.movie._id;
    const movieObj = req.body.movie;
    let _movie;

    // 更新
    if (typeof(id) !== 'undefined') {
        Movie.findById(id, function(err, movies) {
            if (err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj);
            _move.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }

                // 重定向到当前 id 的详情页
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        // 新添加一条数据
        _movie = new Movie({
            director: movieObj.doctor,
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

app.listen(port);

console.log('imooc started on port: ' + port);