const apiKey = "YOUR_OMDB_API_KEY";
const baseUrl = "https://www.omdbapi.com/";
const movieDetails = document.getElementById("movieDetails");

// Get the IMDb ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get("imdbID");

if (imdbID) {
    fetchMovieDetails(imdbID);
}

async function fetchMovieDetails(id) {
    const res = await fetch(`${baseUrl}?i=${id}&apikey=${apiKey}`);
    const data = await res.json();

    if (data.Response === "True") {
        const poster = data.Poster !== "N/A" 
            ? data.Poster 
            : "https://via.placeholder.com/200x300?text=No+Image";

        movieDetails.innerHTML = `
          <div class="movie-details">
            <div class="poster">
              <img src="${poster}" alt="${data.Title}">
            </div>
            <div class="info">
              <h2>${data.Title} (${data.Year})</h2>
              <p><strong>Genre:</strong> ${data.Genre}</p>
              <p><strong>Director:</strong> ${data.Director}</p>
              <p><strong>Actors:</strong> ${data.Actors}</p>
              <p><strong>Plot:</strong> ${data.Plot}</p>
              <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
            </div>
          </div>
        `;

    } else {
        movieDetails.innerHTML = "<p>Movie details not found!</p>";
    }
}


const submitBtn = document.getElementById("submitReview");
const reviewsList = document.getElementById("reviewsList");

// Load existing reviews for this movie
let reviews = JSON.parse(localStorage.getItem(imdbID)) || [];
displayReviews();

// When user submits a review
submitBtn.addEventListener("click", () => {
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value.trim();
    if (comment) {
        const review = { rating, comment, date: new Date().toLocaleString() };
        reviews.push(review);
        localStorage.setItem(imdbID, JSON.stringify(reviews));
        displayReviews();
        document.getElementById("comment").value = "";
    }
});

// Function to show reviews
function displayReviews() {
    reviewsList.innerHTML = "";
    if (reviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews yet!</p>";
        return;
    }
    reviews.forEach(r => {
        const div = document.createElement("div");
        div.classList.add("review");
        div.innerHTML = `<strong>${r.rating} ⭐</strong> - ${r.comment} <br><small>${r.date}</small>`;
        reviewsList.appendChild(div);
    });
}

submitBtn.addEventListener("click", () => {
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();

  if (!rating || rating < 1 || rating > 5) {
    alert("Please give a rating between 1 and 5 ⭐");
    return;
  }
  if (!comment) {

    return;
  }

  const review = { rating, comment, date: new Date().toLocaleString() };
  reviews.push(review);
  localStorage.setItem(imdbID, JSON.stringify(reviews));
  displayReviews();
  document.getElementById("comment").value = "";
});


function displayReviews() {
  reviewsList.innerHTML = "";
  if (reviews.length === 0) {
    reviewsList.innerHTML = "<p>No reviews yet!</p>";
    return;
  }

  let total = 0;
  reviews.forEach(r => total += parseInt(r.rating));
  let avg = (total / reviews.length).toFixed(1);

  reviewsList.innerHTML = `<h3>Average Rating: ⭐ ${avg}</h3>`;

  reviews.forEach(r => {
    const div = document.createElement("div");
    div.classList.add("review");
    div.innerHTML = `<strong>${r.rating} ⭐</strong> - ${r.comment} <br><small>${r.date}</small>`;
    reviewsList.appendChild(div);
  });
}


function displayReviews() {
    reviewsList.innerHTML = "";
    if (reviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews yet!</p>";
        return;
    }
    reviews.forEach((r, index) => {
        const div = document.createElement("div");
        div.classList.add("review");

        div.innerHTML = `
            <strong>${r.rating} ⭐</strong> - ${r.comment} 
            <br><small>${r.date}</small>
            <br>
            <button onclick="deleteReview(${index})">Delete</button>
        `;

        reviewsList.appendChild(div);
    });
}

// Function to delete a review by index
function deleteReview(index) {
    reviews.splice(index, 1);
    localStorage.setItem(imdbID, JSON.stringify(reviews)); // update localStorage
    displayReviews();
}


let currentPage = 1;
async function fetchMovies(query, page = 1) {
  const res = await fetch(`${baseUrl}?s=${query}&page=${page}&apikey=${apiKey}`);
  const data = await res.json();
  if (data.Response === "True") {
    displayMovies(data.Search);
    movies_store.innerHTML += `
      <button onclick="fetchMovies('${query}', ${page - 1})" ${page===1?"disabled":""}>Prev</button>
      <button onclick="fetchMovies('${query}', ${page + 1})">Next</button>
    `;
  } else {
    movies_store.innerHTML = `<p>No movies found!</p>`;
  }
}
