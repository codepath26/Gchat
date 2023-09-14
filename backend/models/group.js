import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const GroupChat = sequelize.define('groupchat' , {
  groupName : {
    type : DataTypes.STRING,
    allowNull : false,
  }
})

export default GroupChat ;