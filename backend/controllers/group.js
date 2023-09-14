import User from "../models/user.js";
import Admin from "../models/admin.js";
import GroupChat from "../models/group.js";
import sequelize from "../utils/database.js";
import { Op, where } from "sequelize";
let members= [];

export const getGroups =async (req ,res)=>{
  const t =  await sequelize.transaction();
  console.log(req.user)
try{
  const groups = await GroupChat.findAll({
    attributes : ["id" , "groupName"],
    include : [
      {
        model : User,
        attributes :[],
        where : {id : req.user.id},
      },
    ],
  },{transaction : t});
  await t.commit()
  res.json({
    groups : groups,
  });
  console.log(groups)

}
catch(err){
  console.log(err)
  await t.rollback();
  res.status(500).json({
    success : false,
  });
};
};

export const getMembers = async(req,res)=>{
  const gpId = req.query.gpId;
  console.log(gpId)
  const t = sequelize.transaction()
  try{
    const groupAdminMembers = await GroupChat.findOne({
      where : {
        id : gpId
      },
      attributes : [],
      include : [
        {
          model :User,
          attributes : ["id" , "userName"],
          include : [{

            model : Admin,
            where :{groupchatId : gpId},
          },
          ],
        },
      ],
    });
    console.log(groupAdminMembers.users);
    const adminUserIds = groupAdminMembers.users.map (user=>{
      return user.id;
    });
    console.log(adminUserIds);
    const groupOtherMembers = await GroupChat.findOne({
      where : {
        id : gpId,
      },  
      attributes : [],
      include : [{
        model : User , 
        attributes : ["id" , "userName"],
        where : {
          id : {
            [Op.notIn] : adminUserIds
          },
        },
      
      }],
    });
    console.log(groupAdminMembers)
const adminmembers = groupAdminMembers.users.map(user =>{
  return {
    id: user.id,
    name: user.userName,
    isAdmin: true,
  };
});
let othermembers ;
const othermembersIds = [];
if(groupOtherMembers){
  othermembers = groupOtherMembers.users.map((user)=>{
    othermembersIds.push(user.id);
   return {
    id: user.id,
    name: user.userName,
    isAdmin: false,
  }
});
}
else{
  othermembers = [];
}
members = [...adminUserIds , ...othermembersIds];
res.json({
  members : [...adminmembers , ...othermembers],
  success : true,
});
}
  catch(err){
    res.status(500).json({
      success :false,
    });
  };
};

export const getNonMembers = async (req ,res)=>{
  const gpId = req.query.gpId;
  try{
    const users = await User.findAll({
      where : {
        id : {[Op.notIn] : members}
      },
      attributes : ["id" , [sequelize.col("userName") , "name"]],
    });
    res.json({
      users : users ,
    });
  }
  catch (err){
    console.log(err);
    res.status(500).json({
      success : false,
    });
  }
};
