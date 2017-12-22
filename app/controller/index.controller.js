var Movie = require('../models/movie');
// 首页
exports.index = function(req, res) {
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
};