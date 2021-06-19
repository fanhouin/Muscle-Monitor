const mongoose = require('mongoose')
const Schema = mongoose.Schema

const equipmentSchema = new Schema({
    name: {type: String, require: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    device_id: {type: Schema.Types.ObjectId, ref: 'Device', require: true},
    weight: {type: Number, require: true},
    record: [{
        weight: {type: Number, require: true},
        set: {type: Number, require: true},
        _date: {type: Date, default: Date.now, require: true},
    }]
})

const Equipment = mongoose.model('Equipment', equipmentSchema)
module.exports = Equipment