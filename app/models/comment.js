var mongoose = require('mongoose');
// 引入模式文件
var CommentSchema = require('../schemas/comment');
// 编译成 Comment 模型
var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;