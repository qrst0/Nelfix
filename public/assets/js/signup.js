'use strict';

import { postDataToServer } from "./api.js";


const email = document.getElementById("email-form");
const username = document.getElementById("username-form");
const fullname = document.getElementById("fullname-form");
const password = document.getElementById("pw-form");
const submitter = document.getElementById("submitter");
const inv = document.getElementById("invalid-rem");


submitter.addEventListener("click", async () => {
    const user = username.value;
    const em = email.value;
    const pw =  password.value;
    const fullnm = fullname.value;
    await postDataToServer(`http://localhost:3000/fecomm/signup`, 'POST', {"username": user, "fullname": fullnm, "email": em, "password": pw}, ( {status, message, data} ) => {
        if(status !== "success"){
            inv.classList.add("active");
            inv.textContent = message;
            return;
        }
        window.localStorage.setItem("nelfix-token", data.token);

        window.location.replace('http://localhost:3000')
    });
});

email.addEventListener("click", async() => {
    inv.classList.remove("active");
});

password.addEventListener("click", async() => {
    inv.classList.remove("active");
});

email.addEventListener("click", async() => {
    inv.classList.remove("active");
});

username.addEventListener("click", async() => {
    inv.classList.remove("active");
});