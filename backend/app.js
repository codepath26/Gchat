import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import sequelize from './utils/database.js';



import loginRoutes from './routes/login.js'
import messageRoutes from './routes/message.js'


import User from './models/user.js';
import groupMes from './models/message.js';
const app = express();
app.use(bodyParser.json());   
app.use(cors());



User.hasMany(groupMes);
groupMes.belongsTo(User , {onDelete : 'CASCADE'})



app.use('/user',loginRoutes);
app.use('/group',messageRoutes)
sequelize.sync({alter : true});

app.listen(3000)