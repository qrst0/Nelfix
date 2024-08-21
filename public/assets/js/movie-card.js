'use strict';

import { imageBaseURL } from "./api.js";

export function createMovieCard(movie){
    let { id, title, director, release_year, genre, price, duration, cover_image_url } = movie;
    if(!cover_image_url){
        cover_image_url = "./assets/images/default-poster.jpg";
    }
    release_year = release_year.toString();
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
    <figure class="poster-box card-banner">
        <img src="${cover_image_url}" alt="${title}" class="img-cover">
    </figure>
    <h4 class="title">${title}</h4>
    <div class="meta-list">
        <div class="meta-item">
            <img src="./assets/images/star-raw (1).png" width="20" height="20" loading="lazy" alt="rating">
            <span class="span">${price.toString()}</span>
        </div>
        <div class="card-badge">${release_year}</div>
        <a href="./detail" class="card-btn" title="${title}" onclick="getMovieDetail(${id})"></a>
    </div>
    `;
    return card;
}