import  jwt  from "jsonwebtoken";

import User from "../model/userModel.js";


const protect = async(req,res,next)=>{
   

   const token = localStorage.getItem('token')
    console.log(token,">>>>>>>>>>>>>>>>")
    if(token){
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            req.user = await User.findById(decoded.userId).select('-password')

            next()
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, invalid token')
        }
    }else{
        res.status(401)
        throw new Error('Not authorised, no token')
    }
}

export {protect};