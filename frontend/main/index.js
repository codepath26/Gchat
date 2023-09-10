

const message = document.getElementById("type-message");
const button = document.getElementById("send-message");
const ul = document.getElementById("chat-list");
const menuButton = document.getElementById("menu-button");
const menuContainer = document.getElementById("menu-container");
const grouplist = document.getElementById("grouplist");
console.log(message);
console.log(button);

button.addEventListener("click", async () => {
  try {
    const m1 = message.value;
    const id = localStorage.getItem('gid');
    if (m1) {
      const obj = {
        message: m1,
        gId : id
      };
      const token = localStorage.getItem("token");
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
