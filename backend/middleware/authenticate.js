
import dotenv from 'dotenv'
dotenv.config();
import jwt from "jsonwebtoken";
import User from '../models/user.js'

const authenticateUser = async (req,res ,next)=>{
  try{
  //  console.log(req.headers)
  const token = req.headers["authentication"];
    const secretkey = process.env.JWT_SECRET_KEY
// console.log(token)

    const data =  jwt.verify(token,secretkey);
    // console.log(data)
    const user =  await User.findOne({where : { id : data.id}});
    // console.log(user);
    if(user){
      req.user = user ;
      next();
    }else{
      return res.status(404).json({message : "user is not found"})
    }
   
  }catch(err){
    return res.status(403).json({success:false})
  }  
}
export default authenticateUser;