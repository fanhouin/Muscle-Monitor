const mongoose = require('mongoose')
const Schmea = mongoose.Schema

const equipmentSchmea = new Schmea({
    name: {type: String, require: true},
    weight: {type: Number, require: true},
    set: {type: Number, require: true},
},{
    timestamps: true,
})

const Equipment = mongoose.model('Equipment', equipmentSchmea)
module.exports = Equipment