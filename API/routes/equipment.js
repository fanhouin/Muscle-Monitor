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
    "name": "first-equipment'
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
    "equipment_id": "xxxxxxxxxxxxxxxxxxxx",
    "mac": "xxx"
}
*/
router.post('/change_equipment_device', verify, async (req, res) => {
    try {
        //check the muscle's name if it is exist
        const exist_device = await Device
            .findOne({user_id: req.user._id, mac: req.body.mac})
            .exec()

        if(!exist_device) return res.status(400).send('Bad request')

        const equipment = await Equipment.findOneAndUpdate( //update device's muscle that it changed the muscle
            {_id: req.body.equipment_id}, //equipment's id
            {'device_id': exist_device._id})
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
    "equipment_id": "xxxxxxxxxxxxxxxxxxxx",
    "weight": "5"    it means 5kg
}
*/
router.post('/change_equipment_weight', verify, async (req, res) => {
    try {
        const equipment = await Equipment
            .findOne({user_id: req.user._id, _id: req.body.equipment_id})
            .populate('device_id','mac')
            .exec()
        if(!equipment) return res.status(400).send('Bad request')
    
        const msg = {
            mac: equipment.device_id.mac,
            info: 'equipment_weight,' + req.body.name
        }
        mqtt_clinet.write('app@@@@' + JSON.stringify(msg))
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


module.exports = router