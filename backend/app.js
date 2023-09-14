import dotenv from 'dotenv'
dotenv.config();

import http from 'http'
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';
import { Server } from 'socket.io';



import sequelize from './utils/database.js';
import { getUserDetails } from  "./utils/user-base.js";
// import { storeMultimedia } from  "./utils/multimedia.js";
import {addChat} from './utils/chat-base.js'
// import { moveChatToArchive } from  "./utils/corn.js";








// Router
import userRoutes from './routes/user.js'
import chatRoutes from './routes/chat.js'
import newGroupRoutes from './routes/new-group.js'
import groupRoutes from './routes/groups.js'
import adminRoutes from './routes/admin.js'


// Dtatbasemodels
import User from './models/user.js';
import Chat from './models/chat.js';
import GroupChat from './models/group.js';
import Admin from './models/admin.js';
import ArchiveChat from './models/archiveChat.js';





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();


app.use(
  cors({
    origin: "http://127.0.0.1:5501",
    credentials : true,
  }));
  const server = http.createServer(app);
  const io =  new Server(server ,{
    cors : {

      origin: "http://127.0.0.1:5501",
      credentials : true,
    }

  });
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({extended : true}));   

//Middleware Routing
app.use("/user",userRoutes)
app.use("/chat",chatRoutes)
app.use("/new-group",newGroupRoutes)
app.use("/groups",groupRoutes)
app.use("/admin",adminRoutes)
app.use(express.static(join(__dirname, `public`)));


// associations
User.hasMany(Chat)
Chat.belongsTo(User);

User.hasMany(ArchiveChat);
ArchiveChat.belongsTo(User);

GroupChat.hasMany(Chat);
Chat.belongsTo(GroupChat);

GroupChat.hasMany(ArchiveChat);
ArchiveChat.belongsTo(GroupChat);

User.belongsToMany(GroupChat , {through : "usergroup"});
GroupChat.belongsToMany(User , {through : "usergroup"});

GroupChat.hasMany(Admin)
User.hasMany(Admin);

const BOTNAME = "GchatBot"

//Run when client connects
io.on('connection', (socket)=>{
  socket.on("joinRoom",async ({userId,gpId ,userName})=>{
    console.log(userId);
    console.log(gpId);
    console.log(userName);
    if(gpId){
      console.log(`${userName} joined ${gpId}`);
      socket.join(gpId);
      
    // For the Current User
    socket.emit("message" , {
      userId : -1,
      message : "welcome to Gchat",
      userName : BOTNAME,
      gpId : -1
    })
    //Broadcast when user connects to chats
    socket.to(gpId).emit('message',{
      userId  : -1,
      message: `${userName} has connected to the Chat`,
      userName : BOTNAME,
      gpId : -1,
    })

   }
  });
  socket.on('chatMessage',async(data)=>{
    console.log(data);
    if(data.gpId){

      const [formattedDate] = await Promise.all([
        getUserDetails(data.userId , data.message),
        addChat(data.gpId , data.message , data.userId),
      ]);
      console.log(formattedDate)
      socket.to(data.gpId).emit("message",formattedDate)
    }
  });
  socket.on("upload" , async(fileData , cb)=>{
    console.log(fileData)
    const fileUrl = await storeMultimedia(
      fileData.fileBuffer,
      fileData.gpId,
      fileData.filename
    );
    console.log(fileUrl)
    addChat(fileData.gpId , fileUrl , fileData.userId);
    cb(fileUrl);
  });

  // when leaving the room
  socket.on('leaveRoom' ,({userId , gpId , userName})=>{
    console.log(userId);
    console.log(gpId);
    console.log(userName);
    if(gpId){
      socket.to(gpId).emit('message',{
        userId : -1,
        message : `${userName} has left  the chat`,
        userName : BOTNAME,
        gpId : -1,
      });
      console.log(`${userName} left ${gpId}`)
      socket.leave(gpId);
    };
  });
});

sequelize
.sync()
// .sync({force : true})
// .sync({alter : true})
.then(()=>{
  server.listen(3000);
})
.catch((err)=>{console.log(err)});