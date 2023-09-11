import dotenv from 'dotenv'
dotenv.config();

import { Sequelize } from "sequelize";
 const sequelize = new Sequelize( process.env.DATABASE_NAME , process.env.DATABASE_USER , process.env.DATABASE_PASS,{
  dialect : 'mysql',
  host : process.env.DATABASE_HOST,
 
 })

 export default sequelize ;

