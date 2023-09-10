import { Op, where } from "sequelize";
import groupMes from "../models/message.js";
import group from "../models/group.js";
import UserGroup from "../models/UserGroup.js";
import User from "../models/user.js";

export const postmess = async (req, res) => {
  try {
    const { message,gId } = req.body;
    // console.log(req.user.id);
    const mescreate = await groupMes.create({
      message: message,
      userId: req.user.id,
      GroupId : gId
    });
    res.status(201).json(mescreate);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getmess = async (req, res) => {
  try {
    const message = req.query.lastmsgId;
    if (message === "undefined") {
      let id = -1;
      const data = await groupMes.findAll({
        where: {
          id: {
            [Op.gt]: id,
          },
        },
      });

      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const creategroup = async (req, res) => {
  try {
    // console.log(1 , req.body)
    const { userstogroup , gname } = req.body;
    const createg = await group.create({
      gName: gname,
    });
    // console.log(createg)
    const groupId = createg.id
    const userAssociation = userstogroup.map(id =>({
      userId : id,
      groupId : groupId,
      isadmin: false,
    }))
    userAssociation.push({
      userId : req.user.id,
      groupId : groupId,
      isadmin : true,
    })
 console.log(userAssociation.length)
    const bulk = await UserGroup.bulkCreate(userAssociation);
    // console.log(bulk)
    res.status(200).json({
      group :createg,
      message : "Group and association created successfully"
    })
  } catch (err) {
    res.status(500).json({message : "something went wrong, internal server error" , err : err});
  }
};

export const fetchusers = async( req ,res )=>{
  try{
    const user =  await User.findAll();
    res.status(201).json(user);
}
  catch(err){
    res.status(500).json(err);
}
}  

export const getgroupname = async(req,res)=>{
  try{
    console.log("1")
    const user = await User.findOne({
      where : {id : req.user.id},
      include : [{
        model : group,
        through : {
          model :UserGroup,
        attributes: ['isadmin'],
     }, },],
    })
  console.log("2")
 if(user){
  console.log(user);
  const groups  = user.Groups
  if (groups.length > 0) {
    const groupInfo = groups.map(group =>
      ({
        groupId : group.id ,
        groupName : group.gName ,
        isAdmin : group.UserGroup.isadmin ,
      }));
      console.log("1")
      return res.status(200).json({groups : groupInfo})
      
    }else{
      return res.status(404).json({message : "user is not part of any group"});
    }
  }
  
  else{
    return res.sattus(404).json({message : "user is not part of the group"});
  }
  
}catch(err){
   console.log(err)
  res.status(500).json({message : "internal server error"})
}
}

export const getgroupmessage = async(req,res)=>{
  try{
    const id = req.query.id;
    console.log(id)
    const messages =await groupMes.findAll({
      where : {
        GroupId : id ,
      }
    })
    console.log(messages)
    return res.status(201).json(messages)
  }catch(err){
    res.status(500).json(err)
  }

}
