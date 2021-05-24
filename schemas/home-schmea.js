const mongoose = require('mongoose')
const Schema = mongoose.Schema

const homeschema = new Schema({
    gym_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Gym',
        require: true,
    },
    address:{
        type: String,
        require: true,
    }
})

const Home = mongoose.model('Home', homeschema)
module.exports = Home