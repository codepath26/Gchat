import groupMes from "../models/message.js";

export const postmess = async(req,res)=>{
  try{
  const {message} = req.body;
  console.log(req.user.id)
  const mescreate = await groupMes.create({
    message : message,
    userId : req.user.id 
  })
  res.status(201).json(mescreate);
  }catch(err){
    return res.status(500).json(err);
  }
 
}