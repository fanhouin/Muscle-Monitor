const mongoose = require('mongoose')
const Schema = mongoose.Schema

const muscleSchema = new Schema({
    name: {type: String, require: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User' ,require: true},
    record: [{
        times: {type: Number, require: true},
        work_time: {type: Number, require: true},
        weight: {type: Number, require: true},
        _date: {type: Date, default: Date.now, require: true}
    }]
})

const Muscle = mongoose.model('Muscle', muscleSchema)
module.exports = Muscle