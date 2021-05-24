const router = require('express').Router()
const User = require('../schemas/users-schmea')
const Device = require('../schemas/devices-schmea')
const Muscle = require('../schemas/muscles-schmea')
const verify = require('./token-validity')

router.post('/add_device', verify, async (req, res) =>{
    try{
        const device = new Device({
            name: req.body.name,
            position: req.body.position,
            user_id: req.body.user_id,
            muscle_id: ''
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

router.get('/get_device', verify, async (req, res) =>{
    try{
        const user = await User
            .findOne({_id: req.user._id})
            .populate('device_id')
            .exec()

        if(!user) return res.status(400).send('Bad require')
        res.send(user.device_id)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

module.exports = router