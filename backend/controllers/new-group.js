import GroupChat from "../models/group.js";
import User from "../models/user.js";
import sequelize from "../utils/database.js";




export const postNewGroup = async (req, res)=> {
  const t = await sequelize.transaction();
  const { groupName } = req.body;
  console.log(groupName)
  try {
    const gpChat = await GroupChat.create({
      groupName : groupName ,
    } ,{transaction : t}
    );
   console.log("this")

     await Promise.all ([
      gpChat.addUser(req.user.id , {transaction : t}),
      gpChat.createAdmin({
        userId : req.user.id,
      },{transaction : t}
      ),
     ]);
     await t.commit();
     res.status(201).json({
      gp : gpChat,
     });
  } catch (err) {
    await t.rollback();
    res.status(500).json({message : "something went wrong, internal server error" , err : err});
  }
};

export const postUpdateGroup = async ( req ,res)=>{
  const {groupName} = req.body;
  const gpId = req.query.gpId;
  const t =  await sequelize.transaction();
  try{
    await GroupChat.update({
      name : groupName,
    },
    {where : {id : gpId}},
    {transaction : t},    
    );
    await t.commit();
    res.json({
      success : true,
    });
  }
  catch(err){
    await t.rollback()
    console.log(err);
    res.status(500).json({
      success :false 
    });
  };
};

export const getUsers = async( req ,res )=>{
  try{
    const users =  await User.findAll({
      attributes:["id" ,"userName" , "email"],
    });
    res.status(201).json({
      users : users
    });
}
  catch(err){
    res.status(500).json({
      success : false ,
    });
}
};  

export const addUserToGroup = async (req,res)=>{
  const t = await  sequelize.transaction();
  const userId = req.query.userId;
  const gpId = req.query.gpId;
  try{
    const group = await GroupChat.findByPk(gpId)
    await group.addUser(userId,{transaction : t});
    await t.commit();
    res.status(200).json({
      success  : true 
    });
  }
  catch(err){
    console.log(err);
    await t.rollback()
    res.status(500).json({
      success : false,
    });
  }
};

export const deleteUserFromGroup = async (req ,res)=>{
  const t = await sequelize.transaction();
  const userId = req.query.userId;
  const gpId = req.query.gpId;
  try {
    const group = await GroupChat.findByPk(gpId);
    await group.removeUser(userId, { transaction: t });
    await t.commit();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
}








export const getgroupname = async(req,res)=>{
  try{
    // console.log("1")
    const user = await User.findOne({
      where : {id : req.user.id},
      include : [{
        model : group,
        through : {
          model :UserGroup,
        attributes: ['isadmin'],
     }, },],
    })
  // console.log("2")
 if(user){
  // console.log(user);
  const groups  = user.Groups
  if (groups.length > 0) {
    const groupInfo = groups.map(group =>
      ({
        groupId : group.id ,
        groupName : group.gName ,
        isAdmin : group.UserGroup.isadmin ,
      }));
      // console.log("1")
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
    // console.log(id)
    const messages =await groupMes.findAll({
      where : {
        GroupId : id ,
      }
    })
    // console.log(messages)
    return res.status(201).json(messages)
  }catch(err){
    res.status(500).json(err)
  }

}
