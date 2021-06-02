const mongoose = require('mongoose')
const Schema = mongoose.Schema

//This is user schamea which is use to login and register
const userSchema = new Schema({
    email : {type: String, require:true, min:6, max:255},
    password: {type: String, require:true, min:6, max:1024},
    name : {type: String, require:true, max:20},
    device_id : [{type: Schema.Types.ObjectId, ref: 'Device', require: true}],
    muscle_id : [{type: Schema.Types.ObjectId, ref: 'Muscle', require: true}],
    equipment_id : [{type:Schema.Types.ObjectId, ref: 'Equipment', require: true}],
})

const User = mongoose.model('User', userSchema)
module.exports = User