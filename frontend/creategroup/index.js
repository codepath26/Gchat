const form = document.getElementById('form')
const gName = document.getElementById('group-name')
const userlist = document.getElementById("userlist");
const save = document.getElementById("save");
const container = document.getElementById("container-1");
const adminlist =[];
const removelist = [];
const ids = [];





const creategroup = async(e)=>{
  try{
    e.preventDefault();
    console.log("this")
    const response = await axios.get('http://localhost:3000/group/users');
    response.data.forEach(user =>{
      userlist.innerHTML +=`<li class="list" value = ${user.username}>${user.username}<button class="btn adduser" id="adduser">add</button><input id='id' type='hidden' value = ${user.id} /></li>`
    })
    container.classList.remove('d-none')
    container.classList.add('container-1')
  }catch(err){
 console.log(err)
  }
}
form.addEventListener('submit' , creategroup);








async function addToGroup(e){
  if(e.target.classList.contains('adduser')){
    const button = e.target
    e.target.classList.remove('adduser')
    const li = button.parentElement;
    ids.push(li.querySelector('#id').value)
    button.style.display = "none"
    li.innerHTML +=`<button class="btn make_admin">make admin</button><button class="btn remove">remove</button>` 
  } 
  if(e.target.classList.contains('remove')){
    const removebtn = e.target
    const li = e.target.parentElement
    const buttons = li.getElementsByTagName('button');
    const button = li.querySelector('#adduser');
    const adminbtn = li.querySelector('.make_admin');
   button.style.display = "block"
   removebtn.style.display = "none";
   adminbtn.style.display = "none";
  }
  if(e.target.classList.contains('make_admin')){
    
  }

}

userlist.addEventListener('click' , addToGroup);



const addusertogroup = async()=>{
 const obj = {
  userstogroup : ids,
  gname : gName.value,
}
console.log(ids)
console.log(obj)
const token = localStorage.getItem('token');
const group = await axios.post('http://localhost:3000/group/creategroup' , obj,
   {
    headers : {
      Authorization : token
    }
   });
   console.log(group);
   window.location.href = "../main/index.html"

}
save.addEventListener('click',addusertogroup);






