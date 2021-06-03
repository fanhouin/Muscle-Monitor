const router = require('express').Router()
const Equipment = require('../schemas/equipments-schema')
const User = require('../schemas/users-schema')
const verify = require('./token-validity')

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
            muscle_id: null,
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


module.exports = router