//validation the auth message
const Joi = require('@hapi/joi')

const registerValidation = (data) =>{
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email()
            .min(6),
            
        password: Joi.string()
            // .pattern(new RegExp('^[a-zA-Z0-9]{6,15}$'))
            .min(6)
            .max(15)
            .required(),
    
        name: Joi.string()
            .required()
            .max(20),
    })

    return schema.validate(data)
}

const loginValidation = (data) =>{
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email()
            .min(6),
            
        password: Joi.string()
            // .pattern(new RegExp('^[a-zA-Z0-9]{6,15}$'))
            .min(6)
            .max(15)
            .required(),
    })

    return schema.validate(data)
}

module.exports = {
    registerValidation,
    loginValidation
}


