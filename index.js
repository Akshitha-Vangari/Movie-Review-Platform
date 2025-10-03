const apiKey = "YOUR_OMDB_API_KEY";
const baseUrl = "https://www.omdbapi.com/";


const search_btn = document.getElementById("searchbtn");
const movie_search = document.getElementById("moviesearch");
const movies_store = document.getElementById("moviesstore");


search_btn.addEventListener("click", () => {
    const query = movie_search.value.trim();
    if (query) {
        fetchMovies(query);
    }
});


async function fetchMovies(query) {
    const res = await fetch(`${baseUrl}?s=${query}&apikey=${apiKey}`);
    const data = await res.json();

    if (data.Response === "True") {
        displayMovies(data.Search);
    } else {
        movies_store.innerHTML = `<p>No movies found!</p>`;
    }
}


function displayMovies(movies) {
    movies_store.innerHTML = "";

    movies.forEach(movie => {
        const poster = movie.Poster !== "N/A" 
            ? movie.Poster 
            : "https://via.placeholder.com/200x300?text=No+Image";

        movies_store.innerHTML += `
        <div class="movie-card">
            <img src="${poster}" alt="${movie.Title}">
            <h2>${movie.Title} (${movie.Year})</h2>
            <button onclick="window.location.href='details.html?imdbID=${movie.imdbID}'">
                View Details
            </button>
        </div>
        `;
    });
}
