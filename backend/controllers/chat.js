import { Op } from "sequelize";
import Chat from "../models/chat.js";
import Admin from "../models/admin.js";
import User from "../models/user.js";
import sequelize from "../utils/database.js";

export const postchat = async (req, res) => {
  const { message } = req.body;
  const gpId = req.query.gpId;
  const t = await sequelize.transaction();
  try {
    const chat = await req.user.createChat({
      message: message,
      groupchatId : gpId
    },{transaction : t});

    await t.commit();

    res.status(201).json({
      success : true,
    });
  } catch (err) {
       await t.rollback()
    return res.status(500).json({
      success : false,
    });
  }
};

export const getChat = async (req, res) => {
  const lastMsgId = req.query.lastMsgId;
  const gpId = req.query.gpId;
  const t =await sequelize.transaction();
  try {
      const chats = await Chat.findAll({
        where :{id : {[Op.gt]:lastMsgId},
        groupchatId : gpId },
        include :[
          {
            model : User,
            attributes : ['userName'],
          },
        ],
      },{transaction : t}
      );
      const adminRecord = await Admin.findAll({
        where : {
          userId : req.user.id,
          groupchatId : gpId,
        },
      } , {transaction : t},
      );
      const isAdmin = adminRecord.length !== 0;
      await t.commit();
      res.json({
        success : true,
        chats : chats,
        isAdmin : isAdmin,
      });
    }
   catch (err) {
    await t.rollback();
    res.status(500).json({ message: "something went wrong" ,success : false });
  }
};

