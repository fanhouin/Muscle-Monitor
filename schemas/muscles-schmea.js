const mongoose = require('mongoose')
const Schmea = mongoose.Schema

const muscleSchmea = new Schmea({
    name: {type: String, require: true},
    times: {type: Number, require: true},
    work_time: {type: Number, require: true},
    user_id: {type: Schmea.Types.ObjectId, ref: 'User' ,require: true},
    equipment_id: {type: Schmea.Types.ObjectId, ref: 'Equipment' ,require: true},
},{
    timestamps: true,
})

const Muscle = mongoose.model('Muscle', muscleSchmea)
module.exports = Muscle