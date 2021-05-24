const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gymSchema = new Schema({
    first: {
        type: String,
        require: true,
    },
    second: {
        type: String,
        require: true,
    }
},{
    timestamps: true
})

const Gym = mongoose.model('Gym', gymSchema)
module.exports = Gym
