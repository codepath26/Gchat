import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";


const Chat = sequelize.define('chat',{
 message :{
  type : DataTypes.TEXT
 }
});
export default Chat ;