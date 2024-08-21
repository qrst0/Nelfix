'use strict';

import { fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");


sidebar();

let currentPage = 1;
let totalPages = 0;

const displayAllMovies = function({total_pages, data}) {
    if(data === undefined){
        escapeSequence(2);
        return;
    }
    const movieList = data;
    totalPages = total_pages;
    document.title = `Bought Movies - Nelfix`;
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list", "genre-list");
    movieListElem.ariaLabel = `Bought Movies`;
    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h1 class="heading">Bought Movies</h1>
        </div>
        <div class="grid-list">
              
        </div>
        <button class="btn load-more" load-more>Load More</button>
    `;

    for(const movie of movieList){
        const movieCard = createMovieCard(movie);

        movieListElem.querySelector(".grid-list").appendChild(movieCard);
        
    }
    pageContent.appendChild(movieListElem);
    document.querySelector("[load-more]").addEventListener
    ("click", function() {
        if(currentPage >= totalPages){
            this.style.display = "none";
            return;
        }
        currentPage++;
        this.classList.add("loading");
        fetchDataFromServer(`http://localhost:3000/fecomm/get-bought?page=1`, 'GET', ({data}) => {
            if(data === undefined){
                escapeSequence(2);
                return;
            }
            this.classList.remove("loading");
            const movieList = data;
            for(const movie of movieList){
                const movieCard = createMovieCard(movie);

                movieListElem.querySelector(".grid-list").appendChild(movieCard);  
            }
        });

    })
}

await confHeader();

fetchDataFromServer(`http://localhost:3000/fecomm/get-bought?page=1`, 'GET', displayAllMovies);
//displayAllMovies(genre_name, totalPages, data);

search();