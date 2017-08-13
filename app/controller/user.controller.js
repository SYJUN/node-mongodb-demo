var User = require('../models/user');

// signup
exports.signup = function(req, res) {
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
};

// 退出
exports.logout = function(req, res) {
    delete req.session.user;
    // delete app.locals.user;

    res.redirect('/');
};