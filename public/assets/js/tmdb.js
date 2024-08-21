'use strict';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YWIyYmY1N2ZmYmQzZGYwNTFiZjBmNTUwNGYxYmE5MyIsIm5iZiI6MTcyNDE1OTg0OC4yNjY0NSwic3ViIjoiNjZjNDk2OWY3M2M3YjFiNDRkZDM0ODkyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.lMu-NmDQ_lTKdD8qNBpI7vbXDTjSrMx7CdtGhqJFeQ8";

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

const default_trailer_url = "PvKiWRTSAzg";

const baseUrl = 'https://api.themoviedb.org/3/search/movie';

export async function fetchTrailer(title){
    const url = baseUrl + '?'  + new URLSearchParams({
        query: title,
        include_adult: true
    }).toString();
    let results = [];
    await fetch(url, options)
        .then(res => res.json())
        .then(async (json) => {
            if(json.results.length === 0){
                results = [`https://www.youtube.com/embed/${default_trailer_url}`];
                return;
            }
            let id = json.results[0].id;
            let curPop = json.results[0].popularity;
            for(let i = 1; i < json.results.length; i++){
                if(json.results[i].popularity > curPop){
                    curPop = json.results[i].popularity;
                    id = json.results[i].id;
                }
            }
            const detailUrl = `https://api.themoviedb.org/3/movie/${id.toString()}/videos`;
            await fetch(detailUrl, options)
                .then(res => res.json())
                .then((json) => {
                    if(json.results.length === 0){
                        results = [`https://www.youtube.com/embed/${default_trailer_url}`];
                        return;
                    }
                    let taken = 0;
                    for(const video of json.results){
                        if(taken === 6) break;
                        if(video.site !== "YouTube" || (video.type !== "Trailer" && video.type !== "Clip")) continue;
                        taken++;
                        results.push(`https://www.youtube.com/embed/${video.key}`);
                    }
                });
        });
    
    return results;
}