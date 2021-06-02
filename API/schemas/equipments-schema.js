const mongoose = require('mongoose')
const Schema = mongoose.Schema

const equipmentSchema = new Schema({
    name: {type: String, require: true},
    user_id: {type: Schema.Types.ObjectId, require: true},
    muscle_id: {type: Schema.Types.ObjectId, require: true},
    record: [{
        weight: {type: Number, require: true},
        set: {type: Number, require: true},
        _date: {type: Date, default: Date.now, require: true},
    }]
})

const Equipment = mongoose.model('Equipment', equipmentSchema)
module.exports = Equipment