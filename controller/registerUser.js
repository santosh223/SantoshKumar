const user = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.signup = async(req, res)=>{
    try {
        const{name,  email, password} = req.body;

        const existingUser = await user.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success:false,
                message : 'User already exist',
            });
        }

        let hasedPassword;
        try {
            hasedPassword = await bcrypt.hash(password, 10);
        } 
        catch (error) {
            return res.status(500).json({
                success:false,
                message: 'Erron in hasing password'
            })
        }

        const userData =  await user.create({
            name, email, password:hasedPassword
        })

        return res.status(200).json({
            success:true,
            userData,
            message:'User created successfully',
        })
    }
    
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        })
          
    }
}

exports.login = async(req, res)=>{
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details'
            });
        }

        const userDoc = await user.findOne({email})

        if(!userDoc){
            return res.status(401).json({
                success: false,
                message: 'Please Signup'
            });
        }

        const payload = {
            id: userDoc._id,
            name: userDoc.name,
            email:userDoc.email
        }

        const isMatch = await bcrypt.compare(password, userDoc.password);

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        let token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:"4hr"} );

        userDoc.password = undefined;

        const options = {
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token: userDoc,
            user: userDoc,
            message: 'User logged in Successfully'
        });
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failed"
        })        
    }
}
