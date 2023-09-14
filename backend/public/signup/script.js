  const eyeIcon = document.querySelector(".eye-icon");
  const form = document.getElementById("form");
  const email = document.getElementById("email");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const CP = document.getElementById("c-password");

  const alert1 = document.getElementById("alert1");







 
  const formdata = async (e) => {
    e.preventDefault();

    if (password.value !== CP.value) {
      alert1.style.display = "block";
      alert1.style.color = 'red'
      alert1.textContent = "Please Check The Password";
    } else {
      const obj = {
        userName: username.value,
        email: email.value,
        password: password.value,
      };

      try {
        let response = await axios.post("http://localhost:3000/user/signup", obj);
     
        const user = response.data
        if(user.message){
          alert1.style.display = "block"
          alert1.style.color = 'red'
          alert1.innerHTML = user.message;
        }else{

          window.location.href = '../login/login.html'
          username.value = '',
          email.value = '',
          password.value = ''
          CP.value = '';
        }
      } catch (err) {
        if(err.response.status === 409){
           alert1.style.display = "block"
           alert1.style.color = 'red'
           alert1.innerHTML = err.response.data.message;
        }else{
          // console.log(err);
        }
        
      }
    }
  };

  const eyecon = async () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");  
    pwFields.forEach((password) => {
   
    if (password.type === "password") {
      password.type = "text";
      eyeIcon.classList.replace("bx-hide", "bx-show");
      return;
    }
    password.type = "password";
    eyeIcon.classList.replace("bx-show", "bx-hide");
  });
};


// adding the eventlistner
form.addEventListener("submit", formdata);
eyeIcon.addEventListener("click",eyecon)
 

