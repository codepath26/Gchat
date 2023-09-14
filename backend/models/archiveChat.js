import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const ArchiveChat = sequelize.define('archivechat',{
  
  message : DataTypes.STRING,
}

)
export default ArchiveChat;