'use strict';

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

const addEventOnElements = function (elements, eventType, callback) {
    for(const elem of elements) elem.addEventListener(eventType, callback);
}

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function () {
    searchBox.classList.toggle("active");
});

const getMovieDetail = function(movieId) {
    window.localStorage.setItem("movieId", movieId.toString());
}

const getMovieList = function(genre) {
    window.localStorage.setItem("genreName", genre);
}

const confHeader = async function () {
    let authenticated = false;
    let username = null;
    let balance = '?';
    await fetchDataFromServer(`http://localhost:3000/fecomm/authme`, 'GET', ({ status, message, data }) => {
        if(status === "success"){
            authenticated = true;
            username = data.username;
            balance = data.balance.toString();
        }
    });
    const logout_btn = document.getElementById("logout-btn");
    const login_btn_div = document.getElementById("logout-btn-div");
    if(authenticated){
        const login_btn = document.getElementById("login-btn");
        const coin_label = document.getElementById("coin-div-label");
        login_btn_div.classList.add("active");
        login_btn.classList.remove("active");
        coin_label.classList.add("active");
        const span_coin_label = coin_label.querySelector("span");
        span_coin_label.textContent = balance;
        logout_btn.innerText = username;
    }
    login_btn_div.addEventListener("mouseover", () => {
        logout_btn.innerText = 'Log out';
    });
    login_btn_div.addEventListener("mouseout", () => {
        logout_btn.innerText = username;
    });
}

const logout = function () {
    window.localStorage.removeItem("nelfix-token");
    window.location.href = './login';
}

const escapeSequence = function(severity){
    if(severity === 2){
        window.localStorage.removeItem("nelfix-token");
        window.location.href = './login';
    }else if(severity === 1){
        window.location.href = './index';
    }else{
        window.localStorage.removeItem("nelfix-token");
        window.location.href = './login';
    }
}