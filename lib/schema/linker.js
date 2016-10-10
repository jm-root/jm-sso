var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//常用联系信息
var schemaDefine = {
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    isme:{type: Boolean, default: false},  //是否自己
    idtype: {type: String},       //证件类型
    idcard: {type: String, index: true},  //证件号
    nick: {type: String},  //昵称
    name: {type: String, index: true},  //姓名
    linkmobile: {type: String},   //联系电话
    linkman: {type: String},  //紧急联系人姓名电话
    status: {type: Number,  default: 0}, //-1:已删除
    crtime: {type: Date, default: Date.now},     //创建时间
    moditime: {type: Date}                        //修改时间
};

module.exports = function(schema, opts) {
    schema = schema ||  new Schema();
    schema.add(schemaDefine);
    return schema;
};
