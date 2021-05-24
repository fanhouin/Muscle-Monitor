const mongoose = require('mongoose')
const Schmea = mongoose.Schema

const deviceSchmea = new Schmea({
    name: {type: String, require: true},
    position: {type: String, require: true},
    user_id: {type: String, ref: 'User', require: true},
    muscle_id: {type: String, ref: 'Muscle', require: true},
})

const Device = mongoose.model('Device', deviceSchmea)
module.exports = Device