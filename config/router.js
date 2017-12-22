var Index = require('../app/controller/index.controller');
var User = require('../app/controller/user.controller');
var Movie = require('../app/controller/movie.controller');
// var bodyParser = require('body-parser');

module.exports = function(app) {
  // app.use(bodyParser.urlencoded({ extended: true }));
  
  // 会话持久逻辑预处理
  app.use(function(req, res, next) {
    var _user = req.session.user;
    
    app.locals.user = _user;
    
    next();
  });
  
  /**
   * Index
   */
  // 首页
  app.get('/', Index.index);
  
  
  /**
   * User
   */
  // 注册
  app.post('/user/signup', User.signup);
  // 登录
  app.post('/user/signin', User.signin);
  // 登录跳转页
  app.get('/signin', User.showSignin);
  // 注册跳转页
  app.get('/signup', User.showSignup);
  // 退出
  app.get('/logout', User.logout);
  // 用户列表
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist);
  // 列表页删除 API
  app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.userDel);
  
  
  /**
   * Movie
   */
  // 详情页
  app.get('/movie/:id', Movie.detail);
  // 后台录入页
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
  // 更新电影信息
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  // 添加新电影或者保存修改
  app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
  // 电影列表页
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.movielist);
  // 列表页删除 API
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);
  
  
  // 实现 404 页面
  app.get('*', function(req, res) {
    res.render('404', {
      title: 'No Found'
    })
  });
};
