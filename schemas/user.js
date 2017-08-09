var mongoose = require('mongoose');
// 密码加盐
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: ture, //唯一的
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
// 数据每次存贮之前都要调用此方法
UserSchema.pre('save', function(next) {
    var user = this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    });
});

// 定义静态方法，静态方法在Model层就能够使用
UserSchema.statics = {
    // 取出数组中所有列表数据，按照更新时间排序
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    // 按照 id 查找单条数据
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb);
    }
};

module.exports = UserSchema;