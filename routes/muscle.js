const router = require('express').Router()
const Device = require('../schemas/devices-schema')
const Muscle = require('../schemas/muscles-schema')
const Equipment = require('../schemas/equipments-schema')
const User = require('../schemas/users-schema')
const verify = require('./token-validity')


/* 
the post form should be
{
     "device_id": "xxxxxxxxxxxxxxxxxxxx",
     "name": "biceps'
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
                {_id: req.body.device_id}, //device's id
                {'muscle_id': exist_muscle._id})
            const successMsg = {
                "message": 'ok',
                "detials": 'changed success',
            }
            return res.json(successMsg)
        }
        
        //if the muscle isn't exist, create new one
        const muscle = new Muscle({
            name: req.body.name,
            user_id: req.user._id,
            equipment_id: null,
            record: [{
                times: 0,
                work_time: 0,
            }]
        })
        const new_muscle = await muscle.save() //create a muscle
        const device = await Device.findOneAndUpdate( //update device's muscle that it added the muscle
            {_id: req.body.device_id},
            {'muscle_id': new_muscle._id})
        const addUserMuscle = await User
            .findOneAndUpdate({_id: req.user._id},
            {'$push':{
                'muscle_id': new_muscle._id
            }})

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

/* 
the post form should be
{
     "equipment_id": "xxxxxxxxxxxxxxxxxxxx",
     "name": "biceps'
}
*/
router.post('/change_equipment_muscle', verify, async (req, res) => {
    try {
        //check the muscle's name if it is exist
        const exist_muscle = await Muscle
            .findOneAndUpdate(
                {user_id: req.user._id, name:req.body.name},
                {equipment_id: req.body.equipment_id})
            .exec()
        
        if(exist_muscle){
            const equipment = await Equipment.findOneAndUpdate( //update device's muscle that it changed the muscle
                {_id: req.body.equipment_id}, //device's id
                {'muscle_id': exist_muscle._id})
            const successMsg = {
                "message": 'ok',
                "detials": 'changed success',
            }
            return res.json(successMsg)
        }
        
        //if the muscle isn't exist, create new one
        const muscle = new Muscle({
            name: req.body.name,
            user_id: req.user._id,
            equipment_id: req.body.equipment_id,
            record: [{
                times: 0,
                work_time: 0,
            }]
        })
        const new_muscle = await muscle.save() //create a muscle
        const equipment = await Equipment.findOneAndUpdate( //update device's muscle that it added the muscle
            {_id: req.body.device_id},
            {'muscle_id': new_muscle._id})
        const addUserMuscle = await User
            .findOneAndUpdate({_id: req.user._id},
            {'$push':{
                'muscle_id': new_muscle._id
            }})

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

//nothing query to be required
router.get('/get_ALLmuscle', verify, async (req, res) => {
    try{
        const muscles = await Muscle
            .find({user_id: req.user._id})
            .exec()

        if(!muscles) return res.status(400).send('Bad require')
        res.send(muscles)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

/* 
the post form should be
{
     "name": "biceps'
}
*/
router.get('/get_muscle', verify, async (req, res) => {
    try{
        const muscle = await Muscle
            .findOne({user_id: req.user._id, name:req.body.name})
            .exec()

        if(!muscle) return res.status(400).send('Bad require')
        res.send(muscle)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


module.exports = router