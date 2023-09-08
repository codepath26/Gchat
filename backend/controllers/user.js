import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



export const signup = async(req ,res)=>{
  try{
    const {username , email,password} = req.body;
    const find = await User.findOne({where : {email : email}})

    if(find){
      return res.status(402).json({message : "User already exists, Please Login"})
    }else{
     
      const hashPassword = await bcrypt.hash (password , 10);
      try{

       const  user = await User.create({
          username : username,
          email : email,
          password : hashPassword
        })
        const id = user.id
        const token = jwt.sign({username,id ,email} , process.env.JWT_SECRET_KEY)  
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
  try{

    const {email,password} = req.body
    const data = await bcrypt.compare(password , req.user.password);
    if(data){
    return res.status(201).json(data)
    }else{
      return res.status(404).json({message : 'Incorrect Password'})
    }
  }catch(err){
    res.status(500).json(err);
  }
}