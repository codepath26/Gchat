import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


export const signup = async(req ,res)=>{
  try{
    const {username , email,password} = req.body;
    const find = await User.findOne({where : {email : email}})
    console.log(find)
    if(find){
      return res.status(402).json({message : "User already exists, Please Login"})
    }else{
     
      const hashPassword = await bcrypt.hash (password , 10);
      const token = jwt.sign({username,email} , process.env.JWT_SECRET_KEY)  
      try{

       const  user = await User.create({
          username : username,
          email : email,
          password : hashPassword
        })
        res.status(200).json({user : user , token :  token})
      }catch(err){
        return res.status(500).json({message : "something went wrong, user not created"})
      }
    }
  }catch(err){
    return res.status(500).json({err : err , message: "internal server error"});
  }
}

export const logincheck = async(req ,res)=>{
  const {email,password} = req.body;
  
  
}