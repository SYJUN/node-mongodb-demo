var mongoose = require('mongoose');
// 密码加盐
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
  name: {
    unique: true, //唯一的
    type: String
  },
  password: String,
  /**
   * 根据规则数值的大小来决定用户的层级，数值越大，层级越高
   * 0: nomal user(默认用户)
   * 1: verified user(高级用户)
   * 2：professonal user
   *
   * >10: admin(管理员)
   * >50: super admin(超级管理员)
   */
  role: {
    type: Number,
    default: 0
  },
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

// 实例方法
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) console.log(err);
      
      cb(null, isMatch);
    })
  }
};

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