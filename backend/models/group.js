import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const group = sequelize.define('Group' , {
  gName : {
    type : DataTypes.STRING,
    allowNull : false,
  }
})

export default group ;