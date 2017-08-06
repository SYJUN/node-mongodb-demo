const mongoose = require('mongoose');
// 引入模式文件
const MovieSchema = require('../schemas/movie');
// 编译成 Movie 模型
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;