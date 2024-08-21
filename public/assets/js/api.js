'use strict';

const imageBaseURL = 'http://localhost:3000'

function getToken(){
    const token = window.localStorage.getItem("nelfix-token") || "";
    return token;
}

const fetchDataFromServer = async function(url, method, callback, optionalParam){
    const bearer_token = getToken();
    const response = await
    fetch(url, {
        method: method,
        headers: new Headers({
            'Authorization': 'Bearer ' + bearer_token
        })
    }).then((result) => result.json())
    .then((data) =>{
        callback(data, optionalParam);
    });
}

const postDataToServer = async function(url, method, args, callback, optionalParam){
    const bearer_token = getToken();
    const response = await
    fetch(url, {
        method: method,
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + bearer_token
        }),
        body: JSON.stringify(args)
    }).then((result) => result.json())
    .then((data) =>{
        callback(data, optionalParam);
    });
}

const confHeader = async function (login_btn, coin_label) {
    let authenticated = false;
    let username = null;
    fetchDataFromServer(`http://localhost:3000/fecomm/authme`, 'GET', ({ status, message, data }) => {
        if(status === "success"){
            authenticated = true;
            username = data.username;
        }
    });
    if(authenticated){
        login_btn.classList.remove("active");
        coin_label.classList.add("active");
        const span_coin_label = coin_label.querySelector("span");
        let balance = '?';
        fetchDataFromServer(`http://localhost:3000/fecomm/user?q=${username}`, 'GET', ({ status, data }) => {
            if(status === "success"){
                balance = data.balance.toString();
            }
        });
        span_coin_label.textContent = balance;
    }
}

export { fetchDataFromServer, postDataToServer, confHeader};