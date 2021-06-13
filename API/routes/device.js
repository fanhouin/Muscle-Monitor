const router = require('express').Router()
const User = require('../schemas/users-schema')
const Device = require('../schemas/devices-schema')
const Muscle = require('../schemas/muscles-schema')
const verify = require('./token-validity')
const mqtt_clinet = require('./mqtt_client')
const utf8 = require('utf8');

/* 
the post form should be
{
    "mac": "CC:50:E3:4A:56:E4"
}
*/
router.post('/add_device', verify, async (req, res) =>{
    try{
        const device = new Device({
            mac: req.body.mac,
            user_id: req.user._id,
            muscle_id: null,
        })
        const new_device = await device.save()
        const user = await User.findOneAndUpdate(
            {_id: req.user._id},
            {'$push':{
                'device_id': new_device._id
            }})
        
        const successMsg = {
            "message": 'ok',
            "detials": 'add device success',
        }
        res.json(successMsg)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

//nothing query to be required
router.get('/get_ALLdevice', verify, async (req, res) =>{
    try{
        const device = await Device
            .find({user_id: req.user._id})
            .exec()

        if(!device) return res.status(400).send('Bad request')
        
        res.send(device[0])
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


/* 
the post form should be
{
    "mac": "CC:50:E3:4A:56:E4",
    "name": "Right Bicep"
}
*/
router.post('/change_device_muscle', verify, async (req, res) => {
    try {
        //check the muscle's name if it is exist
        const exist_muscle = await Muscle
            .findOne({user_id: req.user._id, name:req.body.name})
            .exec()
        
        if(exist_muscle){
            const device = await Device.findOneAndUpdate( //update device's muscle that it changed the muscle
                {user_id: req.user._id, mac: req.body.mac}, //device's id
                {'muscle_id': exist_muscle._id})
            const successMsg = {
                "message": 'ok',
                "detials": 'changed success',
            }
            console.log(req.body.mac)
            //send the message to the real device, let it know which muscle
            const msg = {
                mac: req.body.mac,
                user_id: req.user._id,
                info: 'muscle_name,' + req.body.name
            }
            mqtt_clinet.write('app@@@@' + JSON.stringify(msg))
            return res.json(successMsg)
        }
        
        //if the muscle isn't exist, create new one
        const muscle = new Muscle({
            name: req.body.name,
            user_id: req.user._id,
            record: []
        })
        const new_muscle = await muscle.save() //create a muscle
        const device = await Device.findOneAndUpdate( //update device's muscle that it added the muscle
            {mac: req.body.mac},
            {'muscle_id': new_muscle._id})
        const addUserMuscle = await User
            .findOneAndUpdate({_id: req.user._id},
            {'$push':{
                'muscle_id': new_muscle._id
            }})

        //send the message to the real device, let it know which muscle
        const msg = {
            mac: req.body.mac,
            user_id: req.user._id,
            info: 'muscle_name,' + req.body.name
        }
        mqtt_clinet.write('app@@@@' + JSON.stringify(msg))

        const successMsg = {
            "message": 'ok',
            "detials": 'create success',
        }
        res.json(successMsg)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


module.exports = router