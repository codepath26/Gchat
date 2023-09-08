  const eyeIcon = document.querySelector(".eye-icon");
  const form = document.getElementById("form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const alert1 = document.getElementById("alert1");
// console.log(email);
 

 const toggleicon = async ()=>{
  try{
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll('.password')
    pwFields.forEach((inputField)=>{
    if(inputField.type === 'password'){
      inputField.type = "text";
      eyeIcon.classList.replace('bx-hide' ,'bx-show');
      return;
    }
    inputField.type = 'password';
    eyeIcon.classList.replace('bx-show' , 'bx-hide')
    })
  }catch(err){
    console.log(err);
  }
 }

//  loginuser
const loginuser = async () =>{
  try{
    const token = localStorage.getItem('token')
    
     const obj = {
      email : email.value,
      password : password.value
     }
     let data = await axios.post(`http://localhost:3000/user/login` ,obj ,{
      headers : {
        'Authorization' : token
      }
     });
     console.log(data);
     window.location.href = '../main/index.html'
  }
  catch(err){

    if(err.response.status === 404){
      alert1.style.display = 'block'
      alert1.style.color = 'red'
      alert1.innerText = err.response.data.message
    }else{
      console.log(err)

    }
  }
}
 eyeIcon.addEventListener('click' , toggleicon);
 form.addEventListener('submit' , loginuser)



