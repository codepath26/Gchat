import { Op, where } from "sequelize";
import groupMes from "../models/message.js";
import group from "../models/group.js";
import UserGroup from "../models/UserGroup.js";
import User from "../models/user.js";

export const postmess = async (req, res) => {
  try {
    const { message } = req.body;
    console.log(req.user.id);
    const mescreate = await groupMes.create({
      message: message,
      userId: req.user.id,
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
    const { groupname } = req.body;
    const createg = await group.create({
      gName: groupname,
    });

    const id = createg.id;
    const merger = await UserGroup.create({
      userId: req.user.id,
      groupId: id,
    });
    res.status(200).json({merger : merger , creategroup  : createg , message : "assosiation created success"})

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
