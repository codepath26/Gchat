
import dotenv from 'dotenv'
dotenv.config();
import jwt from "jsonwebtoken";
import User from '../models/user.js'

const authenticateUser = async (req,res ,next)=>{
  try{

    const token = await req.headers.authorization
    const secretkey = process.env.JWT_SECRET_KEY
// console.log(token)

    const data =  jwt.verify(token,secretkey);
    // console.log(data)
    const user =  await User.findOne({where : { email : data.email}});
    // console.log(user);
    if(user){
      req.user = user ;
      next();
    }else{
      return res.status(404).json({message : "user is not found"})
    }
   
  }catch(err){
    return res.status(500).json({success:false})
  }  
}
export default authenticateUser;