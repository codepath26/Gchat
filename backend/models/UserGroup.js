import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
const UserGroup = sequelize.define('UserGroup', {
  // No need to define any attributes here
  isadmin :{
    type : DataTypes.BOOLEAN,

  }
});
export default UserGroup ; 