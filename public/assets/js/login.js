'use strict';

import { postDataToServer } from "./api.js";


const email = document.getElementById("email-form");
const password = document.getElementById("pw-form");
const submitter = document.getElementById("submitter");
const inv = document.getElementById("invalid-rem");


submitter.addEventListener("click", async () => {
    const username = email.value;
    const pw =  password.value;
    await postDataToServer(`http://localhost:3000/fecomm/login`, 'POST', {"username": username, "password": pw}, ( {status, message, data} ) => {
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