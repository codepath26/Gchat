import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import sequelize from './utils/database.js';
import loginRoutes from './routes/login.js'
const app = express();
app.use(bodyParser.json());   
app.use(cors());


app.use('/user',loginRoutes);
sequelize.sync({force : false});

app.listen(3000)