// ================ imports ===========================================================================================//

const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

// ================ Authentication Middleware ===========================================================================================//

const authentication = async function (req, res, next) 
{
    
    try 
    { 
        const token = req.headers['x-api-key'];
        
        if (!token)     
            return res.status(400).send({ status: false, msg: "request is missing a mandatory token header" });

        let decodedToken = jwt.decode(token);
        
        if(decodedToken._id == undefined || decodedToken.exp == undefined)
            return res.status(401).send({status : false , message : "Invalid Token."});

        if(Date.now() > decodedToken.exp*1000)
            return res.status(401).send({status : false , message : "Token Expired."});
        
        decodedToken = jwt.verify(token,'projectThird');

        let user = await userModel.findOne({_id : decodedToken._id});

        if(!user)
            return res.status(401).send({status : false , message : "User not found. Authentication failed."});
        
        req.validToken = decodedToken;
        next();
    }
    catch (error) 
    {
        return res.status(500).send({status: false, msg: error.message})
    }
};

// ================ exports ===========================================================================================//

module.exports.authentication=authentication;