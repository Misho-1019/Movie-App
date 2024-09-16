function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    if (favorites.length === 0) {
        movieList.innerHTML = `<p>No favorite movies added yet.</p>`;
        return
    }

    movieList.innerHTML = '';
    favorites.forEach(movie => {
        const movieItem = document.createElement('div')
        movieItem.classList.add('movie')

        movieItem.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
                <button onclick="window.location.href='movieDetails.html?id=${movie.imdbID}'">More Info</button>
                <button onclick="removeFromFavorites('${movie.imdbID}')">Remove from Favorites</button>
            </div>
        `;
        movieList.appendChild(movieItem)
    })
}

function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favMovie => favMovie.imdbID !== imdbID)
    localStorage.setItem('favorites', JSON.stringify(favorites))
    alert('Are sure you want to remove this movie from Favorites?')
    displayFavorites();
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
    }, 3000)
}

window.addEventListener('load', displayFavorites)