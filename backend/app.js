import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import sequelize from './utils/database.js';



import loginRoutes from './routes/login.js'
import messageRoutes from './routes/message.js'


import User from './models/user.js';
import Msg from './models/message.js';
import UserGroup from './models/UserGroup.js';
import group from './models/group.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({extended : true}));   
app.use(cors());



User.hasMany(Msg);
Msg.belongsTo(User , {onDelete : 'CASCADE'});
User.belongsToMany(group , {through : UserGroup , foreignKey : 'userId'});
group.belongsToMany(User , {through : UserGroup , foreignKey : 'groupId'});
group.hasMany(Msg)
Msg.belongsTo(group , {onDelete : 'CASCADE'})



app.use('/user',loginRoutes);
app.use('/group',messageRoutes)
app.use((req,res)=>{
 res.sendFile(join(__dirname , `public/${req.url}`))
})
sequelize.sync({force : false});
// sequelize.sync({alter : true});

app.listen(3000)