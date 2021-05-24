const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deviceSchema = new Schema({
    name: {type: String, require: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    muscle_name: {type: String, ref: 'Muscle', require: true},
})

const Device = mongoose.model('Device', deviceSchema)
module.exports = Device