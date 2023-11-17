import  jwt  from "jsonwebtoken";
import {generateAdminToken} from "../utils/generateUserToken.js";


const protectAdmin = async(req,res,next)=>{
   const authHeader = req.headers.authorization
   if(!authHeader){
    return res.status(400).json({message:"Authorization header is missing"})
   }

   const tocken = authHeader.split(' ')[1]
   if(!tocken){
    return res.status(400).json({message:"tocken is missing"})
   }

   try {
    const tockens = jwt.verify(tocken,process.env.JWT_SECRET)
    if(tockens.role==="user"){
        req.user=tockens;
        return next()
    }
    else{
        return res.status(403).json({message:"Access denied. User role is not allowed."})
    }
   } catch (error) {
    return res.status(401).json({message:"Authorization failed. Invalid tocken"})
   }
}

export {protectAdmin}