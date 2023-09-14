const socket = io('http://localhost:3000',{
reconnection: false});
const token = localStorage.getItem("token");
const newGroup = document.getElementById('n-group');
const logout =  document.getElementById('logout');
const groupListUl = document.getElementById("group-list");
const chatListUl = document.getElementById("chat-list");
const sendButton = document.getElementById("sendmsg");
const fileInput = document.getElementById("file");
const message = document.getElementById("type-message");
const msgcon = document.getElementById("message-container");
const groupHeading = document.getElementById("groupHeading");
const baseHeading = document.getElementById("baseHeading");
const membersList = document.getElementById("members-list");
const info = document.getElementById("info");
const setting = document.getElementById("setting");
const infoDiv = document.getElementById("info-div");
const memberCount = document.getElementById("member-count");
const profile = document.getElementById("G-name");
// console.log(baseHeading)


 


if (!token) {
  window.location.href = "../login/login.html";
}
const currentUser = parseJwt(token);
console.log(currentUser)

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentGpId");
  localStorage.removeItem("newGroupId");
  localStorage.removeItem("messages");
  localStorage.removeItem("newGroupName");
  localStorage.removeItem("currentGpName");
  window.location.href = "../login/login.html";
});


newGroup.addEventListener('click' , ()=>{
  window.location.href = "../newgroup/new-group.html";

})



function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


const openGroupChat = async(e)=>{
  const currentGpId = localStorage.getItem("currentGpId");
  socket.emit("leaveRoom", {
    userId: currentUser.id,
    gpId: currentGpId,
    userName: currentUser.userName,
  });
  const gpId = e.target.id;
  const gpName = e.target.innerText;
  localStorage.setItem("currentGpId", gpId);
  localStorage.setItem("currentGpName", gpName);
  profile.replaceChildren();
  profile.appendChild(document.createTextNode(gpName));
  groupHeading.style.display = "block";
  getMembers();
  await getChats();
  console.log(currentUser);
  socket.emit("joinRoom", {
    userId: currentUser.id,
    gpId: gpId,
    userName: currentUser.userName,
  });

}
//displaychats
const displayChats = async(chat)=>{
  const {userId , message , userName} = chat;
  const li = document.createElement('li')
  let formatedMessage ;
  if (message.includes("https://")) {
    formatedMessage = `<div class="chat-image">
                          <img src=${message} alt="image" />
                        </div>`;
    msgcon.innerHTML =  formatedMessage

  } else {
    formatedMessage = message;
  

  if (currentUser.id === userId) {
    li.className = "list-group-item you-list right";
    li.innerHTML = `<div class="rounded shadow-sm you">
                      ${formatedMessage}
                    </div>`;
  } else if (userId == -1) {
    li.className = "list-group-item left";
    li.innerHTML = `<div class="botDiv">
                      <span class="spanName botName">${userName}:</span>
                      <span class="botMessage">${formatedMessage}</span>
                    </div>`;
  } else {
    li.className = "list-group-item  left";
    li.innerHTML = `<div class="others rounded shadow-sm">
                    <span class="spanName">${userName}</span>
                    <span class="spanMessage">${formatedMessage}</span>
                    </div>`;
  }
  chatListUl.appendChild(li);
  // messageContainer.scrollTop = messageContainer.scrollHeight;

}
  
};




const displayGroups = (group)=>{
  const li = document.createElement("li");
  li.className = "group-list-items users";
  li.id = group.id;
  li.appendChild(document.createTextNode(group.groupName));
  li.addEventListener("click", openGroupChat);
  groupListUl.appendChild(li);
}

const getMembers = async()=>{
  const gpId = localStorage.getItem('currentGpId');
  // membersList.replaceChilder();
  try{
    const response = await axios.get(`http://localhost:3000/groups/getmembers?gpId=${gpId}`,{
      headers : {Authentication: token},
    });
    // console.log(response);
    const {members : users} = response.data;
    const userCount = users.length;
   memberCount.replaceChildren(document.createTextNode(userCount));
  users.forEach(user=>{
    const li = document.createElement("li");
      const spanName = document.createElement("span");
      const spanStatus = document.createElement("span");
      li.id = user.id;
      li.className = "group-list-items";
      spanName.className = "member-name";
      if(currentUser.id === user.id){
        spanName.appendChild(document.createTextNode("You"));

      }else{
        spanName.appendChild(document.createTextNode(user.name));
      }
      if(user.isAdmin){
        if(user.id === currentUser.id){
          setting.style.display = "block"
        }
        spanStatus.className = "status admin";
        spanStatus.appendChild(document.createTextNode("Admin"));

      }else{
        spanStatus.className = "status member";
        spanStatus.appendChild(document.createTextNode("Member"));
      }
      li.appendChild(spanName);
      li.appendChild(spanStatus);
      membersList.appendChild(li);
  })

  }catch(err){
    console.log(err);
  }
};
const getGroups = async()=>{
  try{
    const response = await axios.get(`http://localhost:3000/groups`,{
      headers : {Authentication : token},
    });
    console.log(response.data);
    const groups = response.data.groups;
    groups.forEach(group =>{
      displayGroups(group);
    })
  }catch(err){}

}
const getChats = async()=>{
  chatListUl.replaceChildren();
  const gpId = localStorage.getItem('currentGpId');
  if(gpId){
     baseHeading.style.display = "none";
     groupHeading.style.display = "block";
    let localMessages = JSON.parse(localStorage.getItem("messages"));
    let gpMessages = localMessages && localMessages[gpId] ? localMessages[gpId] : [];
    const lastMsgId = gpMessages.length ? gpMessages[gpMessages.length - 1].id : -1;
    try{
      const response = await axios.get(`http://localhost:3000/chat?lastMsgId=${lastMsgId}&gpId=${gpId}`,{
        headers : {Authentication : token},
      }
      );
      const chats = response.data.chats;
      gpMessages = gpMessages ? [...gpMessages , ...chats] : [...chats];
      if(gpMessages.length){
        while(gpMessages.length > 10){
          gpMessages.shift();
        }
        gpMessages.forEach(chat=>{
          displayChats({
            userId: chat.userId,
            message: chat.message,
            gpId: chat.groupchatId,
            userName: chat.user.userName,
          });
        });
        localMessages[gpId] = gpMessages;
        localStorage.setItem('message' , JSON.stringify(localMessages));

      }
    }catch(err){
      console.log(err)
    }
  }else{
    // chatListUl.innerHTML = `
    // <li class="welcome">
    //           <h3 style="text-align: center">Welcome to Mchat App</h3>
    //       </li>
    //       <li class="welcome">
    //           <h5 style="text-align: center">Chat in groups or in private</h5>
    //       </li>`;
  }

}

const onLoad = async ()=>{
 groupHeading.style.display = "none";
//  baseHeading.style.display ="block"
const gpName = localStorage.getItem('currentGpName')
const gpId = localStorage.getItem('currentGpId')
console.log(gpId);
console.log(gpName);

 profile.replaceChildren(gpName);

if(gpId){
  getMembers();
}
getGroups();
await getChats();
socket.emit("joinRoom",{
  userId: currentUser.id,
  gpId:gpId,
  userName: currentUser.userName,
});
};


window.addEventListener('DOMContentLoaded' , onLoad);

const  postMessage =async (e)=>{
  const msg = message.value
  console.log(msg);
  const gpId = localStorage.getItem('currentGpId')
  const chat = {
    userId : currentUser.id,
    gpId : gpId,
    message :msg,
  }
  socket.emit("chatMessage" , chat);
  console.log(chat)
  displayChats(chat);
  message.value = '';
 
 
}
sendButton.addEventListener('click' , postMessage)

const handleInfo =async ()=>{
  const infoDisplayInfo = infoDiv.style.display;
  console.log(infoDisplayInfo)
  if(infoDisplayInfo !== 'block'){
    console.log("this")
    getMembers();
    infoDiv.style.display = "block"
  }else{
    console.log("that")
    infoDiv.style.display = "none";
  }
};
info.addEventListener('click' , handleInfo);

setting.addEventListener('click' , ()=>{
  const gpId = localStorage.getItem("currentGpId");
  const gpName = localStorage.getItem("currentGpName");
  localStorage.setItem("newGroupId", gpId);
  localStorage.setItem("newGroupName", gpName);
  window.location.href = "../editgroup/edit-group.html";
})




// FileInpute EventListner
fileInput.addEventListener("change",(e)=>{
  e.preventDefault();
  // console.log('this ')
  const file = e.target.files[0];
  const gpId = localStorage.getItem('currentGpId');
  if(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    const fileData = {
      gpId : gpId,
      userId : currentUser.id,
      fileName:file.name,
      fileBuffer : reader.result,
    };
    socket.emit('upload',fileData , (fileUrl)=>{
      displayChats({
      userId : currentUser.id,
      message:fileUrl,
      userName:currentUser.userName,
      });
    });
  };
  reader.readAsArrayBuffer(file);
  }
  
});




socket.on('message' , (data)=>{
  console.log(data);
  displayChats(data);
})












/* 

socket.on('messageReceived',({message})=>{
  console.log(message)
ul.innerHTML += `<li class="left">${message}</li>`;
})
button.addEventListener("click", async () => {
  try {
    const m1 = message.value;
    const id = localStorage.getItem('gid');
    if (m1) {
      const obj = {
        message: m1,
        gId : id
      };
      const groupname = localStorage.getItem('groupName');
      console.log(groupname)
      if(groupname){

        socket.emit('sendMessage' , {message : m1 ,gname : groupname});
      }
   
      const response = await axios.post(
        "http://localhost:3000/group/sendmessage",
        obj,
        {
          headers: {
            Authorization: token,
          },
        }
      );
     
      ul.innerHTML += `<li class="right">${response.data.message}</li>`;
      message.value = "";
    } else {
    }
  } catch (err) {
    console.log(err);
  }
});

const fetchdata = async () => {
  const token = localStorage.getItem("token");
  const data = localStorage.getItem("array");
  try {
    const response = await axios.get("http://localhost:3000/group/gname", {
      headers: {
        authorization: token,
      },
    });
    const groups = response.data.groups;
    console.log(groups);
    groups.forEach((gname) => {
      console.log(`${gname.groupName} ==> ${gname.isAdmin}`);
      grouplist.innerHTML += `<li class="g-list group" value = '${gname.groupName}'>${gname.groupName}<input type="hidden" id='id' value =${gname.groupId}></li>`;
    });
  } catch (err) {
    console.log(err);
  }
  try {
    let id;
    const array = JSON.parse(data);
    if (array) {
      // console.log('get the data from the local storage')
      id = array[array.length - 1].id;
      // console.log(id);
      array.forEach((obj) => {
        ul.innerHTML += `<li class="right">${obj.message}</li>`;
      });
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3000/group/messages?lastmsgId=${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        //  console.log(Array.isArray(response.data))
        localStorage.setItem("array", JSON.stringify(response.data));
        response.data.forEach((res) => {
          ul.innerHTML += `<li class="right">${res.message}</li>`;
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
window.addEventListener("DOMContentLoaded", fetchdata);

// hambergur menu//

menuButton.addEventListener("click", () => {
  if (menuContainer.classList.contains("menu-visible")) {
    // Close the menu by setting the width to 0
    menuContainer.classList.remove("menu-visible");
    menuContainer.classList.add("menu-hidden");
  } else {
    // Open the menu
    menuContainer.classList.add("menu-visible");
    menuContainer.classList.remove("menu-hidden");
  }

  // Toggle the "no-icon" class on the menu button
  menuButton.classList.toggle("no-icon");

  // Check if the slider is open at 250px and reset it to 0 if it is
  if (menuContainer.style.width === "250px") {
    menuContainer.style.width = "0";
  }
});

const switchgroup = async (e) => {
  try{

    const li = e.target;
    const id = li.querySelector("#id");
    const name = li.getAttribute("value");
   localStorage.setItem("groupName" , name);
    
console.log(id.value)
    localStorage.setItem("gid", id.value);
    ul.innerHTML = "";
    const response = await axios.get(`http://localhost:3000/group/gmessage?id=${id.value}`);
   const msgArray = response.data
   if(msgArray.length > 0){
   msgArray.forEach(obj =>{
      ul.innerHTML += `<li class="right">${obj.message}</li>`;
    })
   }
    }catch(err){
      console.log(err);
    }
};

grouplist.addEventListener("click", switchgroup);


*/

