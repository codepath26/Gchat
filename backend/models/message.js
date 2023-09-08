import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";


const groupMes = sequelize.define('GroupMessage',{
 message :{
  type : DataTypes.TEXT
 }
});
export default groupMes ;