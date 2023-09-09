import { Op } from "sequelize";
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

export const getmess =async (req,res)=>{   
     try{
      const message = req.query.lastmsgId;
     if(message === "undefined"){
      let id = -1 ;
      const data = await groupMes.findAll({where : {id : {
        [Op.gt] : id
      }}});
      
      res.status(200).json(data);
    }
  }
      
      catch(err){
        res.status(500).json({message : 'something went wrong'});
      }
   
} 