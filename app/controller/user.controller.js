var User = require('../models/user');

// signup
exports.signup = function(req, res) {
    var _user = req.body.user;

    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err);
        }

        // 如果用户存在，直接跳转到登录页面
        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                console.log(user)
            });

            res.redirect('/');
        }
    });
};

// 用户列表页
exports.userlist = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }

        res.render('userlist', {
            title: '用户列表',
            users: users
        });
    });
};

// 登录
exports.signin = function(req, res) {
    var _user = req.body.user;
    console.log('_user: ', _user)
    var name = _user.name;
    var password = _user.password;

    User.findOne({ name: name }, function(err, user) {
        if (err) {
            console.log(err);
        }

        // 用户不存在，跳转到注册页面
        if (!user) {
            return res.redirect('/signup');
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
                return res.redirect('/signin');
            }
        });
    });
};

// 登录跳转页
exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面'
    });
};

// 注册跳转页
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
    });
};

// 退出
exports.logout = function(req, res) {
    delete req.session.user;
    // delete app.locals.user;

    res.redirect('/');
};

// 列表页删除 API
exports.userDel = function(req, res) {
    var id = req.query.id;

    if (id) {
        User.remove({ _id: id }, function(err, movie) {
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

// 中间件 midware for user - 登录
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user) return res.redirect('/signin');

    next();
}

// 中间件 midware for user - 管理员
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;

    if (typeof(user.role) === 'undefined' || user.role === '' || user.role <= 10) {
        return res.redirect('/signin');
    }

    next();
}