var Movie = require('../models/movie');
var _ = require('lodash');

// 详情页
exports.detail = function(req, res) {
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
};

// 后台录入页
exports.new = function(req, res) {
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
};

// 更新电影信息
exports.update = function(req, res) {
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
};

// 添加新电影的 API post
exports.save = function(req, res) {
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
};

// 列表页
exports.movielist = function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    
    res.render('list', {
      title: '电影列表',
      movies: movies
    });
  });
};

// 列表页删除 API
exports.del = function(req, res) {
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
};