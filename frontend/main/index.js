const message = document.getElementById('type-message')
const button = document.getElementById('send-message')
const ul = document.getElementById('chat-list')
console.log(message)
console.log(button)

button.addEventListener('click',async()=>{
  try{

    const m1 = message.value
    if(m1){
      const obj = {
        message : m1
      }
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:3000/group/sendmessage',obj ,{
        headers : {
          Authorization :  token
        }
      });
      ul.innerHTML += `<li class="right">${response.data.message}</li>` 
      message.value = ''
  
    }else{
      
    }
  }catch(err){
    console.log(err);
  }
})



const fetchdata = async()=>{
  try{
    const token = localStorage.getItem('token');
    setTimeout(async() => {
      const response = await axios.get('http://localhost:3000/group/messages',{
        headers : {
          Authorization : token
        }
      });
      response.data.forEach(res =>{
        ul.innerHTML += `<li class="right">${res.message}</li>`
        
      })
    }, 1000);
   
  }
  catch(err){console.log(err)}

}
window.addEventListener('DOMContentLoaded',fetchdata)