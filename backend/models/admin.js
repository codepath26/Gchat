import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Admin = sequelize.define('admin',{},
{timestamps : false},
)
export default Admin;