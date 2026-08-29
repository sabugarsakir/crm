import bcrypt from 'bcrypt'
import validator from "validator";
import userModel from "../models/User.js";
import jwt from 'jsonwebtoken'

const registerController = async (req, res) => {
    try {
        const {name, email, password, number, role, location} = req.body;

        if (!name || !email || !password || !number || !role || !location) {
            return res.json({success:false, message: "Missing Details"})
        }
    
        if(!validator.isEmail(email)){
            return res.json({success:false, message: "Enter valid email"})
    
        }
        if(!validator.isMobilePhone(number)){
            return res.json({success:false, message: "Enter valid phone number"})
    
        }
    
        if(password.length < 6){
            return res.json({success:false, message: "Enter Strong Password"})
    
        }

        const existingUser = await userModel.findOne({
            $or: [{ email }, { number }]
        });

        if (existingUser) {
            return res.json({ success: false, message: "Email or Phone Number already in use" });
        }
    
        //Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const userData = {
            name,
            email,
            number,
            password: hashedPassword,
            location,
            role,
        }
    
        const newUser = new userModel(userData);
        const user = await newUser.save();
    
        // const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    
        return res.json({success: true, message: "User Created Successfully!"})
    } catch (error) {
        console.error(error);
        return res.json({success: false, message:error})

    }
}

export default registerController