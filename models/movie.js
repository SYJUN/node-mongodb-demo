var mongoose = require('mongoose');
// 引入模式文件
var MovieSchema = require('../schemas/movie');
// 编译成 Movie 模型
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;