const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
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
MovieSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
});

// 定义静态方法，静态方法在Model层就能够使用
MovieSchema.statics = {
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
}

module.exports = MovieSchema