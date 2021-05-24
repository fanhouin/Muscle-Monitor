const router = require('express').Router()
const Device = require('../schemas/devices-schema')
const Muscle = require('../schemas/muscles-schema')
const User = require('../schemas/users-schema')
const verify = require('./token-validity')


/* 
the post form should be
{
     "_id": "xxxxxxxxxxxxxxxxxxxx",
     "name": "biceps'
}
*/
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
            {_id: req.body._id},
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
        const user = await User
            .findOne({_id: req.user._id})
            .populate('muscle_id')
            .exec()

        if(!user) return res.status(400).send('Bad require')
        res.send(user.muscle_id)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


// const exist_muscle = user.muscle_id.find(item => item.name === req.body.name) 
// res.send(exist_muscle)
module.exports = router