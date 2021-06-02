const jwt = require('jsonwebtoken')

const validity = (req, res, next) =>{
    const token = req.header('auth-token')
    if(!token){
        const errMsg = {
            "message": 'error',
            "detials": 'Access Denied',
        }
        return res.status(401).send(errMsg) 
    }

    try{
        const vertified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = vertified
        next()
    }catch(err){
        const errMsg = {
            "message": 'error',
            "detials": 'Invalid Token',
        }
        return res.status(400).send(errMsg)
    }
}

module.exports = validity