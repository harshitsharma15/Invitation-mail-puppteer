const mongoose = require('../db/connection');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    users:{type:Array},
    id:{type:String}
})
const userModel = mongoose.model('users',userSchema);
module.exports = userModel;