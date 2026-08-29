import jwt from 'jsonwebtoken'
import userModel from '../models/User.js';

const authUser = async (req, res, next) => {
  try {

    const {token} = req.headers

    if(!token){
        console.log('Please Login, Your token is expired!')
        return res.json({success: false, message: 'unauthorized access'})
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: token_decode.id });
    
    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found. Please log in again.' });
    }

    req.body.role = user.role;
    req.body.userId = token_decode.id;

    next();
    
} catch (error) {
    res.json({
        success: false,
        message: error.message
    })
}
};

export {authUser}