var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//常用联系地址
var schemaDefine = {
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    isme:{type: Boolean, default: false},  //是否自己
    name: {type: String, index: true},  //姓名
    linkmobile: {type: String},   //联系电话
    country: {type: String},    //国家
    province: {type: String},   //省
    city: {type: String},        //市
    area: {type: String},        //区
    address: {type: String},   //地址
    status: {type: Number,  default: 0}, //-1:已删除
    crtime: {type: Date, default: Date.now},     //创建时间
    moditime: {type: Date}                        //修改时间
};

module.exports = function(schema, opts) {
    schema = schema ||  new Schema();
    schema.add(schemaDefine);
    return schema;
};
