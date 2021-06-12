const mongoose = require('mongoose')
const DB_URL = process.env.DB_URL
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

const equipmentSchema = new Schema({
    name: {type: String, require: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    device_id: {type: Schema.Types.ObjectId, ref: 'Device', require: true},
    record: [{
        weight: {type: Number, require: true},
        set: {type: Number, require: true},
        _date: {type: Date, default: Date.now, require: true},
    }]
})

const Equipment = mongoose.model('Equipment', equipmentSchema)
        
exports.handler = async (event, context, callback) => {
    //context.callbackWaitsForEmptyEventLoop = false;
    mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        .then(() => console.log('connected to db'))
        .catch(err => console.log(err))

    if(event.msg == "muscle"){
        const muscle = await Muscle.findOneAndUpdate(
            {user_id: event.user_id, name: event.muscle_name},
            {'$push':{
                'record': {
                    times: event.count,
                    work_time: event.work_time,
                    weight: event.weight
                }
            }})
        console.log(muscle)
    }
    else if(event.msg == "equipment"){
        const equipment = await Equipment.findOneAndUpdate(
            {user_id: event.user_id, name: event.equipment_name},
            {'$push':{
                'record': {
                    weight: event.weight,
                    set: event.set
                }
            }})     
        console.log("equipment")
    }

    context.done(null,{'statusCode': 200})    
};
