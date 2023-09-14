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
const loginuser = async (e) =>{
  e.preventDefault();
  try{ 
     const obj = {
      email : email.value,
      password : password.value
     }
     let response = await axios.post(`http://localhost:3000/user/login` ,obj);
      const data = response.data
      
      localStorage.setItem('token' , data.token);
      localStorage.setItem('messages' , JSON.stringify({}));
      window.location.href = '../main/index.html'
  }
  catch(err){
    // console.log(err);
      alert1.style.display = 'block'
      alert1.style.color = 'red'
      alert1.innerText = err.response.data.message
  }
}
 eyeIcon.addEventListener('click' , toggleicon);
 form.addEventListener('submit' , loginuser)



