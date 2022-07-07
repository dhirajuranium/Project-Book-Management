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


        
        jwt.verify(token,'projectThird',(err,decoded) =>{
            if(err){
                return res.status(401).send({
                    status : false,
                    message : "Authentication Failed"
                })
            }
            else{
                if(Date.now() > decoded.exp*1000){
                     return res.status(401).send({
                     status : false ,
                     message : "Token Expired."}); 
                }     
               req.validToken = decoded;
                next();
            }
        });

    }
    catch (error) 
    {
        return res.status(500).send({status: false, msg: error.message})
    }
};

// ================ exports ===========================================================================================//

module.exports.authentication=authentication;