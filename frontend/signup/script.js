  const forms = document.querySelector(".forms");
  const pwShowHide = document.querySelectorAll(".eye-icon");
  const links = document.querySelectorAll(".link");
  const form = document.getElementById("form");
  const email = document.getElementById("email");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const CP = document.getElementById("c-password");
  const alert1 = document.getElementById("alert");
  const alert2 = document.getElementById("alert2");








  const formdata = async (e) => {
    e.preventDefault();
    if (password.value !== CP.value) {
      alert1.style.display = "block";
      alert1.textContent = "Please Check The Password";
    } else {
      const obj = {
        username: username.value,
        email: email.value,
        password: password.value,
      };
      alert1.style.display = "none";
      try {
        let response = await axios.post("http://localhost:3000/user/signup", obj);
        const {user , token}  = response.data
        console.log(user);
        console.log(token);
        localStorage.setItem('token' , token)
        username.value = '',
        email.value = '',
        password.value = ''
        CP.value = ''
      } catch (err) {
        if(err.response.status === 402){
           alert2.style.display = "block"
           alert2.style.color = 'red'
           alert2.innerHTML = err.response.data.message;
        }
        console.log(err.response.status)
        console.log(err);
      }
    }
  };

  form.addEventListener("submit", formdata);

  pwShowHide.forEach((eyeIcon) => {
    eyeIcon.addEventListener("click", () => {
      let pwFields =
        eyeIcon.parentElement.parentElement.querySelectorAll(".password");

      pwFields.forEach((password) => {
        if (password.type === "password") {
          password.type = "text";
          eyeIcon.classList.replace("bx-hide", "bx-show");
          return;
        }
        password.type = "password";
        eyeIcon.classList.replace("bx-show", "bx-hide");
      });
    });
  });

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); //preventing form submit
      forms.classList.toggle("show-signup");
    });
  });

  //adding the data to backend

 