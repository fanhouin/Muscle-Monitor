const router = require('express').Router()
const Device = require('../schemas/devices-schema')
const Muscle = require('../schemas/muscles-schema')
const User = require('../schemas/users-schema')
const verify = require('./token-validity')

//TODO: get muscle data 
//add muscle data
//check device uni id(arduino)? 

router.post('/change_muscle', verify, async (req, res) => {
    try {
        const user = await User
            .findOne({_id: req.user._id})
            .populate('muscle_id')
        
        //check the muscle's name if it is exist
        const exist_muscle = user.muscle_id.find(item => item.name === req.body.name) 
        if(exist_muscle){
            const device = await Device.findOneAndUpdate( //update device's muscle that it changed the muscle
                {_id: req.body._id},
                {'muscle_id': exist_muscle._id})
            return
        }
        
        //if the muscle isn't exist, create new one
        const muscle = new Muscle({
            name: req.body.name,
            times: 0,
            work_time: 0,
            user_id: req.user._id,
            equipment: '',
        })
        const new_muscle = await muscle.save() //create a muscle
        const device = await Device.findOneAndUpdate( //update device's muscle that it added the muscle
            {_id: req.body._id},
            {'muscle_id': new_muscle._id})
        const addUserMuscle = await User
            .findOneAndUpdate({_id: req.user._id},
            {'$push':{
                'muscle_id': muscle_id._id
            }})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


router.get('/test_muscle', verify, async (req, res) => {
    // const muscle = new Muscle({
    //     name: req.body.name,
    //     times: 0,
    //     work_time: 0,
    //     user_id: req.user._id,
    //     equipment: '',
    // })
    // const new_muscle = await muscle.save()
    // const addUserMuscle = await User
    // .findOneAndUpdate({_id: req.user._id},
    // {'$push':{
    //     'muscle_id': new_muscle._id
    // }})

    // res.send(muscle)
    const user = await User
        .findOne({_id: req.user._id})
        .populate('muscle_id')
    const exist_muscle = user.muscle_id.find(item => item.name === req.body.name) 
    res.send(exist_muscle)
})

module.exports = router