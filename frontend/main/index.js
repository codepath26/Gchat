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
    const data = localStorage.getItem('array');
   let id;
   const array = JSON.parse(data)
  //  console.log(Array.isArray(array))
    if(array){
      console.log('get the data from the local storage')
     id = array[array.length - 1].id;
      console.log(id);
      array.forEach(obj =>{
        ul.innerHTML += `<li class="right">${obj.message}</li>`
      })
    }else{
      try{
        const response = await axios.get(`http://localhost:3000/group/messages?lastmsgId=${id}`,{
          headers : {
            Authorization : token
          }
        });
         console.log(Array.isArray(response.data))
         localStorage.setItem('array' ,JSON.stringify(response.data))
        response.data.forEach(res =>{
          ul.innerHTML += `<li class="right">${res.message}</li>`
          
        })

        
      }catch(err){
        console.log(err)
      }
     
    }
 
      
   
  }
  catch(err){console.log(err)}

}
window.addEventListener('DOMContentLoaded',fetchdata)