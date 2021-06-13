const router = require('express').Router()
const Device = require('../schemas/devices-schema')
const Muscle = require('../schemas/muscles-schema')
const Equipment = require('../schemas/equipments-schema')
const User = require('../schemas/users-schema')
const verify = require('./token-validity')




//nothing query to be required
router.get('/get_ALLmuscle', verify, async (req, res) => {
    try{
        const muscles = await Muscle
            .find({user_id: req.user._id})
            .exec()

        if(!muscles) return res.status(400).send('Bad request')
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
router.get('/get_muscle_record_sum', verify, async (req, res) => {
    try{
        const muscle = await Muscle
            .findOne({user_id: req.user._id, name:req.body.name})
            .exec()

        if(!muscle) return res.status(400).send('Bad request')
        const record = muscle.record
        let msg = {}
        record.forEach((item, index) =>{
            if (!msg[item.weight]) {
                msg[item.weight] = {count: item.times, work_time: item.work_time/1000}
            }
            else{
                msg[item.weight].count += item.times
                msg[item.weight].work_time += item.work_time/1000
            }
        })
        res.send(msg)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


module.exports = router