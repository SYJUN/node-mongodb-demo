var mongoose = require('mongoose');
// 引入模式文件
var UserSchema = require('../schemas/user');
// 编译成 Movie 模型
var User = mongoose.model('User', UserSchema);

module.exports = User;