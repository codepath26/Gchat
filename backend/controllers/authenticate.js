
import dotenv from 'dotenv'
dotenv.config();
import jwt from "jsonwebtoken";
import User from '../models/user.js'

 const authenticateUser = async (req,res ,next)=>{
 try{
  const {email , password} = req.body;
  console.log(email)
   const token = await req.headers.authorization
  //  console.log(`token : ${token}`)
   const secretkey = process.env.JWT_SECRET_KEY
   const data =  jwt.verify(token,secretkey);
    const user =  await User.findOne({where : { email : email}});
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