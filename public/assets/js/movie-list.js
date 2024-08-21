import { fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";

const genreNamePure = window.localStorage.getItem("genreName");
const genreName = genreNamePure.replace(/\W/g, '').toLowerCase();


const pageContent = document.querySelector("[page-content]");


sidebar();

let currentPage = 1;
let totalPages = 0;

function capitalize(s)
{
    let subs = s.split(' ');
    let newsubs = [];
    for(const sub of subs){
        newsubs.push(sub[0].toUpperCase() + sub.slice(1));
    }
    return newsubs.join(' ');
}

const displayAllMovies = function({genre_name, total_pages, data}) {
    if(data === undefined){
        escapeSequence(2);
        return;
    }
    const movieList = data;
    totalPages = total_pages;
    genre_name = capitalize(genreNamePure);
    document.title = `${genre_name} Movies - Nelfix`;
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list", "genre-list");
    movieListElem.ariaLabel = `${genre_name} Movies`;
    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h1 class="heading">All ${genre_name} Movies</h1>
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
        fetchDataFromServer(`http://localhost:3000/fecomm/films?genre=${genreName}&page=${currentPage}`, 'GET', ({data}) => {
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

fetchDataFromServer(`http://localhost:3000/fecomm/films?genre=${genreName}&page=${currentPage}`, 'GET', displayAllMovies);

search();