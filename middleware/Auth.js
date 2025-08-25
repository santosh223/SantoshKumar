const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.Auth = (req, res)=>{

    try {
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ",  "");

    if(!token){
        return res.status(401).json({
                success:false,
                message:'Token missing',
            });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            
            req.User = payload;
    } 
    
    catch (error) {
        return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
    }

    } 
    
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:error.message,
        })
        
    }
    
}