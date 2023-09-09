const userlist = document.getElementById("userlist");
const save = document.getElementById("save");

const arr1 = []
const fetchdata = async ()=>{
  try{
 const response = await axios.get('http://localhost:3000/group/users');
 console.log(response.data)
 response.data.forEach(user =>{
   userlist.innerHTML +=`<li class="list" value = ${user.username}>${user.username}<button class="btn adduser" id="adduser">add</button></li>`
 })

  }catch(err){
    console.log(err);
  }

}
window.addEventListener('DOMContentLoaded' , fetchdata);



async function addToGroup(e){
  if(e.target.classList.contains('adduser')){
    const button = e.target
    e.target.classList.remove('adduser')
    const li = button.parentElement;
    arr1.push(li.getAttribute('value'))
    button.style.display = "none"
    const ul = e.target.parentElement.parentElement
    const arr = Array.from(ul.children);

    li.innerHTML +=`<button class="btn make_admin">make admin</button><button class="btn remove">remove</button>` 
  } 
  if(e.target.classList.contains('remove')){
    const li = e.target.parentElement
    const buttons = li.getElementsByTagName('button');
    const button = li.querySelector('#adduser');
 
   button.style.display = "block"

  }
}

userlist.addEventListener('click' , addToGroup);
const addusertogroup = async()=>{
 const obj = {
  userstogroup : arr1
 }

}
save.addEventListener('click',addusertogroup);
