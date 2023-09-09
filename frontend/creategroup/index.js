const form = document.getElementById('form')
const gName = document.getElementById('group-name')

const creategroup = async(e)=>{
  try{
    const token = localStorage.getItem('token')
    e.preventDefault();
    const obj = {
      groupname : gName.value
    }
    console.log(token)
    console.log(obj)
   const group = await axios.post('http://localhost:3000/group/creategroup' , obj,
   {
    headers : {
      Authorization : token
    }
   });
 console.log(group);
 window.location.href = './adduser.html'
  }catch(err){
 console.log(err)
  }
}

form.addEventListener('submit' , creategroup);