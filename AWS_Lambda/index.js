const mongoose = require('mongoose')
const DB_URL = process.env.DB_URL
const Schema = mongoose.Schema

//This is user schamea which is use to login and register
const userSchema = new Schema({
    email : {type: String, require:true, min:6, max:255},
    password: {type: String, require:true, min:6, max:1024},
    name : {type: String, require:true, max:20},
    device_id : [{type: Schema.Types.ObjectId, ref: 'Device', require: true}],
    muscle_id : [{type: Schema.Types.ObjectId, ref: 'Muscle', require: true}],
    equipment_id : [{type:Schema.Types.ObjectId, ref: 'Equipment', require: true}],
})
const User = mongoose.model('User', userSchema)

        
exports.handler = async (event, context, callback) => {
    // TODO: upload the muscle data
    //context.callbackWaitsForEmptyEventLoop = false;
    mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('connected to db'))
        .catch(err => console.log(err))
        
    const user = new User({
        email: 'aws@gamil.com',
        password: '121231231323',
        name: 'fan',
        device_id: [],
        muscle_id: [],
        equipment_id: [],
    })
    newuser = await user.save()
    
    context.done(null,{'statusCode': 200})    
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    
    // return response;
};
