const message = document.getElementById('type-message')
const button = document.getElementById('send-message')
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
      console.log(response.data)
      message.value = ''
  
    }else{
      
    }
  }catch(err){
    console.log(err);
  }
})