const mongoose = require('mongoose')
const Schema = mongoose.Schema

const muscleSchema = new Schema({
    Uniname: {type: String, require: true},
    times: {type: Number, require: true},
    work_time: {type: Number, require: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User' ,require: true},
    equipment_name: {type: String, ref: 'Equipment' ,require: true},
},{
    timestamps: true,
})

const Muscle = mongoose.model('Muscle', muscleSchema)
module.exports = Muscle