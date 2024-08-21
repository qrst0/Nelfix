'use strict';

import { fetchDataFromServer, postDataToServer } from "./api.js";

import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { fetchTrailer } from "./tmdb.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

await confHeader();

fetchDataFromServer(`http://localhost:3000/fecomm/films/${movieId}`, 'GET', async function ({message, data}) {
    if(data === undefined){
        if(message === "Forbidden resource") escapeSequence(2);
        else escapeSequence(1);
        return;
    }else if(data === null){
        escapeSequence(1);
        return;
    }
    let { id, title, description, director, release_year, genre, price, duration, video_url, cover_image_url, stat } = data;
    if(!cover_image_url){
        cover_image_url = "./assets/images/default-poster.jpg";
    }
    release_year = release_year.toString();
    price = price.toString();
    const genreString = genre.join(", ");
    let minutesTime = Math.floor(duration / 60).toString();
    let timeMod = "m";

    if(+minutesTime <= 2){
        minutesTime = duration.toString();
        timeMod = "s";
    }
    
    document.title = `${title} - Nelfix`;
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    let cond_btn = 'btn';

    if(stat === 3){
        cond_btn = 'btn disabled';
    }

    let text_cond_btn = 'Watch Now';

    if(stat >= 2){
        text_cond_btn = 'Buy Now';
    }

    let url_cond_btn = video_url;

    if(stat === 0){
        url_cond_btn = './login';
    }else if(stat != 1){
        url_cond_btn = 'javascript:void(0);';
    }

    let id_cond_btn = 'main-btn';

    if(stat != 2){
        id_cond_btn = 'main-btn-disabled';
    }

    movieDetail.innerHTML = `
    <div class="backdrop-image" style="background-image: url('${cover_image_url}')"></div>
    <figure class="poster-box movie-poster">
        <img src="${cover_image_url}" alt="${title}" class="img-cover">
    </figure>
    <div class="detail-box">
        <div class="detail-content">
            <h1 class="heading">${title}</h1>
            <div class="meta-list">
                <div class="meta-item">
                    <img src="./assets/images/star-raw (1).png" width="20" height="20" alt="rating">
                    <span class="span">${price}</span>
                </div>
                <div class="separator"></div>
                <div class="meta-item">${minutesTime + timeMod}</div>
                <div class="separator"></div>
                <div class="meta-item">${release_year}</div>
            </div>
            <p class="genre">${genreString}</p>
            <p class="overview">
                ${description}
            </p>
            <ul class="detail-list">
                <div class="list-item">
                    <p class="list-name">Directed By</p>
                    <p>
                        ${director}
                    </p>
                </div>
            </ul>

        </div>
        <a href="${url_cond_btn}" class="${cond_btn}" id="${id_cond_btn}">
            <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
            <span class="span" style="font-size: 125%">${text_cond_btn}</span>
        </a>
        <div class="title-wrapper">
            <h3 class="title-large">Trailers and Clips</h3>
        </div>
        <div class="slider-list">
            <div class="slider-inner">
            </div>
        </div>
    </div>
    `;
    const results = await fetchTrailer(title);

    for(let i = 0; i < results.length; i++){
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        videoCard.innerHTML = `
        <iframe width="500" height="294" src="${results[i]}" frameborder="0" allowfullscreen="1" title="${title}" class="img-cover" loading="eager"></iframe>
        `;
        movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }
    pageContent.appendChild(movieDetail);
    fetchDataFromServer(`http://localhost:3000/fecomm/allfilms`, 'GET', addSuggestedMovies);
});

const addSuggestedMovies = async function({ data }){
    if(data === undefined){
        escapeSequence(2);
        return;
    }
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = `You May Also Like`;
    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">You May Also Like</h3>
        </div>
        <div class="slider-list">
            <div class="slider-inner">
            
            </div>
        </div>
    `;
    for(const movie of data){
        const movieCard = createMovieCard(movie);
        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }
    pageContent.append(movieListElem);
}

search();

document.addEventListener("click", async function(e){
    const target = e.target.closest("#main-btn"); 
    
    if(target){
        await buyThisMovie();
    }
});

async function buyThisMovie(){
    postDataToServer(`http://localhost:3000/fecomm/films/${movieId}`, 'POST', {}, ({status, message, data}) => {
        window.location.href = `http://localhost:3000/detail`
    });
}

