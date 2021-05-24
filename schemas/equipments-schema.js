const mongoose = require('mongoose')
const Schema = mongoose.Schema

const equipmentSchema = new Schema({
    name: {type: String, require: true},
    user_id: {type: Schema.Types.ObjectId, require: true},
    record: [{
        weight: {type: Number, require: true},
        set: {type: Number, require: true},
    },{
        timestamps: true,
    }]
})

const Equipment = mongoose.model('Equipment', equipmentSchema)
module.exports = Equipment