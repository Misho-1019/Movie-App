const apiKey = 'bebf1ae0'

const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get('id')

async function fetchMovieDetails() {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
        const data = await response.json();

        if (data.Response === 'True') {
            document.getElementById('movie-title').textContent = data.Title;
            document.getElementById('movie-poster').src = data.Poster !== 'N/A' ? data.Poster : 'placeholder.jpg'
            document.getElementById('movie-year').textContent = data.Year;
            document.getElementById('movie-genre').textContent = data.Genre;
            document.getElementById('movie-plot').textContent = data.Plot;
            document.getElementById('movie-actors').textContent = data.Actors;

            document.getElementById('add-to-favorites-btn').addEventListener('click', () => addToFavorites(data))
        }else {
            document.querySelector('.container').innerHTML = `<p>Movie not found.</p>`;
        }
    } catch (error) {
        document.querySelector('.container').innerHTML = `<p>Failed to fetch movie details.</p>`;
    }
}

function addToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const isFavorite = favorites.some(favMovie => favMovie.imdbID === movie.imdbID)

    if (!isFavorite) {
        favorites.push(movie)
        localStorage.setItem('favorites', JSON.stringify(favorites))
        showNotification(`${movie.Title} has been added to favorites!`)
    }else {
        showNotification(`${movie.Title} is already in your favorites!`)
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification')
    notification.textContent = message;
    notification.classList.add('show')

    setTimeout(() => {
        notification.classList.add('hide')
        setTimeout(() => {
            notification.classList.remove('show', 'hide')
        }, 500);
    }, 4000)
}

// window.addEventListener('load', displayFavorites)

fetchMovieDetails();