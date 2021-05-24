const router = require('express').Router()
const User = require('../schemas/users-schema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {registerValidation, loginValidation} = require('./auth-validation')

router.post('/register', async(req, res) => {
    //validation
    const validation = registerValidation(req.body)
    if (validation.error){
        const errMsg = {
            "message": 'error',
            "detials": validation.error.details[0].message,
        }
        return res.status(400).send(errMsg) 
    }

    //check the user if it is exist
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist){
        const errMsg = {
            "message": 'error',
            "detials": 'Email already exists',
        }
        try{
            return res.status(400).send(errMsg)
        }
        catch(err){
            console.log(err)
            return res.status(500).json({err})
        }
    }

    //hash password
    const salt = await bcrypt.genSalt(11)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    //register user
    const user = new User({
        email: req.body.email,
        password: hashPassword,
        name: req.body.name,
        device_id: [],
        muscle_name: [],
        equipment_name: [],
    })

    try{
        const saveUser = await user.save()
        const successMsg = {
            message: 'ok',
            detials: 'Successfully registered'
        }
        res.json(successMsg)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({err})
    }
})

router.post('/login', async(req, res) => {
    const validation = loginValidation(req.body)
    if (validation.error){
        const errMsg = {
            "message": 'error',
            "detials": validation.error.details[0].message,
        }
        return res.status(400).send(errMsg) 
    }

    //check the user if it is exist
    const user = await User.findOne({email: req.body.email})
    if (!user){
        const errMsg = {
            "message": 'error',
            "detials": "Email or password is wrong",
        }
        try{
            return res.status(400).send(errMsg)
        }
        catch(err){
            console.log(err)
            return res.status(500).json(err)
        }
    }

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass){
        const errMsg = {
            "message": 'error',
            "detials": "Email or password is wrong",
        }
        try{
            return res.status(400).send(errMsg)
        }
        catch(err){
            console.log(err)
            return res.status(500).json(err)
        }
    }

    //create the token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})

module.exports = router