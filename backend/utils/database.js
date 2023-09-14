import dotenv from 'dotenv'
dotenv.config();

import { Sequelize } from "sequelize";
 const sequelize = new Sequelize( process.env.DATABASE_NAME , process.env.DATABASE_USER , process.env.DATABASE_PASS,{
  dialect : 'mysql',
  host : process.env.DATABASE_HOST,
  pool: {
    max: 5, // maximum number of connections in the pool
    min: 0, // minimum number of connections in the pool
    acquire: 30000, // increase this timeout (in milliseconds)
  },
 
 })

 export default sequelize ;

