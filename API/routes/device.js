const router = require('express').Router()
const User = require('../schemas/users-schema')
const Device = require('../schemas/devices-schema')
const Muscle = require('../schemas/muscles-schema')
const verify = require('./token-validity')

/* 
the post form should be
{
    "name": "first-drive'
}
*/
router.post('/add_device', verify, async (req, res) =>{
    try{
        const device = new Device({
            name: req.body.name,
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

        if(!device) return res.status(400).send('Bad require')
        res.send(device)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


module.exports = router