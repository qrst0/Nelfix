'use strict';

import { sidebar } from "./sidebar.js";
import { fetchDataFromServer } from './api.js';
import { createMovieCard } from './movie-card.js';
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

const homePageSections = [
    {
        title: "Best Affordable Movies",
        path: "http://localhost:3000/fecomm/films?maxprice=200"
    },
    {
        title: "Premium Quality Movies",
        path: "http://localhost:3000/fecomm/films?minprice=210"
    },
    {
        title: "Action Packed Movies",
        path: "http://localhost:3000/fecomm/films?genre=action"
    },
    {
        title: "Adventure Movies",
        path: "http://localhost:3000/fecomm/films?genre=adventure"
    }
]

const heroBanner = async function({ status, message, data}) {
    if(data === undefined){
        escapeSequence(2);
        return;
    }
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = 'Popular Movies';

    banner.innerHTML = `
        <div class="banner-slider"></div>

        <div class="slider-control">
            <div class="control-inner"></div>
        </div>
    `; 
    let controlItemIndex = 0;
    for(const singularData of data){
        let { id, title, director, release_year, genre, price, duration, cover_image_url } = singularData;
        let description = "";
        const resp = await fetchDataFromServer(`http://localhost:3000/fecomm/films/${id}`, 'GET', ({message, data}) => {
            if(data === undefined){
                escapeSequence(2);
                return;
            }else if(data === null){
                escapeSequence(1);
                return;
            }
            ({description} = data);
        });
        if(!cover_image_url){
            cover_image_url = "./assets/images/default-poster.jpg";
        }
        release_year = release_year.toString();
        const genreString = genre.join(", ");

        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item", "");

        sliderItem.innerHTML = `
            <img src="${cover_image_url}" alt="${title}" class="img-cover" loading=${controlItemIndex === 0 ? "eager" : "lazy"}>
            <div class="banner-content">
                <h2 class="heading">${title}</h2>
                <div class="meta-list">
                    <div class="meta-item">${release_year}</div>
                    <div class="meta-item card-badge">${price}</div>
                </div>

                <p class="genre">${genreString}</p>
                <p class="banner-text">
                    ${description}
                </p>

                <a href="./detail" class="btn" onclick="getMovieDetail(${id})">
                    <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
                    <span class="span">Watch Now</span>
                </a>
            </div>
        `;
        banner.querySelector(".banner-slider").appendChild(sliderItem);
        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlItemIndex}`);
        controlItemIndex++;
        
        controlItem.innerHTML = `
        <img src="${cover_image_url}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
        `;
        banner.querySelector(".control-inner").appendChild(controlItem);
    }
    pageContent.appendChild(banner);
    addHeroSlide();

    for(const {title, path} of homePageSections){
        fetchDataFromServer(path, 'GET', createMovieList, title);
    }

}

const addHeroSlide = function() {
    const sliderItems = document.querySelectorAll("[slider-item]");
    const sliderControls = document.querySelectorAll("[slider-control]");
    
    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    const sliderStart = function() {
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");
        sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
        this.classList.add("active");
        lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
        lastSliderControl = this;
    }

    addEventOnElements(sliderControls, "click", sliderStart);
    
}

const createMovieList = async function({ data }, title){
    if(data === undefined){
        escapeSequence(2);
        return;
    }
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = `${title}`;
    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">${title}</h3>
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

await confHeader();

fetchDataFromServer(`http://localhost:3000/fecomm/allfilms`, 'GET', heroBanner);

search();