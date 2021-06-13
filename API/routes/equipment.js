const router = require('express').Router()
const Equipment = require('../schemas/equipments-schema')
const User = require('../schemas/users-schema')
const Device = require('../schemas/devices-schema')
const verify = require('./token-validity')
const mqtt_clinet = require('./mqtt_client')
const utf8 = require('utf8');
const Muscle = require('../schemas/muscles-schema')
/* 
the post form should be
{
    "name": "Left Dumbbell"
}
*/
router.post('/add_equipment', verify, async (req, res) => {
    try {
        const equipment = new Equipment({
            name: req.body.name,
            user_id: req.user._id,
            device_id: null,
            record: [],
        })
        const new_equipment = await equipment.save()
        const user = await User.findOneAndUpdate(
            {_id: req.user._id},
            {'$push':{
                'equipment_id': new_equipment._id
            }})
        const successMsg = {
            "message": 'ok',
            "detials": 'add equipment success',
        }
        res.json(successMsg)

    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})



//nothing query to be required
router.get('/get_ALLequipment', verify, async (req, res) =>{
    try{
        const equipment = await Equipment
            .find({user_id: req.user._id})
            .exec()

        if(!equipment) return res.status(400).send('Bad request')
        res.send(equipment)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


/* 
the post form should be
{
    "name": "Right Dumbbell",
    "mac": "CC:50:E3:4A:56:E4"
}
*/
router.post('/change_equipment_device', verify, async (req, res) => {
    try {
        //check the muscle's name if it is exist
        const exist_device = await Device
            .findOne({user_id: req.user._id, mac: req.body.mac})
            .exec()

        if(!exist_device) return res.status(400).send('Bad request')

        const exist_equipment = await Equipment.findOneAndUpdate( //update device's muscle that it changed the muscle
            {user_id: req.user._id, name: req.body.name}, 
            {'device_id': exist_device._id})

        if(!exist_equipment) return res.status(400).send('Bad request')

        const msg = {
            mac: req.body.mac,
            user_id: req.user._id,
            info: 'equipment_name,' + req.body.name
        }
        mqtt_clinet.write('app@@@@' + JSON.stringify(msg))

        const successMsg = {
            "message": 'ok',
            "detials": 'changed success',
        }
        return res.json(successMsg)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

/* 
the post form should be
{
    "name": "first-name",
    "weight": "5" --> it means 5kg
}
*/
router.post('/change_equipment_weight', verify, async (req, res) => {
    try {
        const equipment = await Equipment
            .findOne({user_id: req.user._id, name: req.body.name})
            .populate('device_id','mac')
            .exec()
        if(!equipment) return res.status(400).send('Bad request')
        const msg = {
            mac: equipment.device_id.mac,
            user_id: req.user._id,
            info: 'equipment_weight,' + req.body.weight
        }
        mqtt_clinet.write('app@@@@' + JSON.stringify(msg))

        const successMsg = {
            "message": 'ok',
            "detials": 'changed success',
        }
        return res.json(successMsg)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


/* 
the post form should be
{
     "name": "first-name"
}
*/
router.get('/get_equipment_record_sum', verify, async (req, res) => {
    try{
        const equipment = await Equipment
            .findOne({user_id: req.user._id, name:req.body.name})
            .exec()

        if(!equipment) return res.status(400).send('Bad request')
        const record = equipment.record
        let msg = {}
        record.forEach((item, index) =>{
            if (!msg[item.weight]) {
                msg[item.weight] = {set: item.set}
            }
            else{
                msg[item.weight].set += item.set
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