const apiKey = 'bebf1ae0'

const container = document.querySelector('.container')
const movieList = document.getElementById('movie-list')
const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const suggestions = document.getElementById('suggestions')

async function fetchMovies(query, page = 1) {
    try {
        document.getElementById('loading').style.display = 'block';

        const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}&page=${page}`)
        const data = await response.json();
    
        document.getElementById('loading').style.display = 'none';
        
    
        if (data.Response === 'True') {
            displayMovies(data.Search)
            setupPagination(query, data.totalResults, page)

            localStorage.setItem('lastSearchQuery', query)
            localStorage.setItem('lastSearchResults', JSON.stringify(data.Search))
        }else {
            movieList.innerHTML = `<p>No results found for "${query}".</p>`;
        }
    } catch (error) {
        movieList.innerHTML = `<p>An error occurred while fetching movie data. Please try again later.</p>`
    }
}

async function fetchMovieSuggestions(query) {
    if (query.length < 2) {
        suggestions.innerHTML = '';
        return
    }

    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
    const data = await response.json();

    if (data.Response === 'True') {
        displaySuggestions(data.Search)
    }else {
        suggestions.innerHTML = '';
    }
}

function displaySuggestions(movies) {
    suggestions.innerHTML = ''; 
    suggestions.style.display = 'block';

    movies.forEach(movie => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = `
        <img src="${movie.Poster}" width=30 height=45 img>  
        <span>${movie.Title} (${movie.Year})</span>`;
        
        
        suggestionItem.addEventListener('click', () => {
            searchInput.value = movie.Title;
            suggestions.innerHTML = ''; 
            fetchMovies(movie.Title);
        });

        suggestions.appendChild(suggestionItem);
    });
}

container.addEventListener('click', () => {
    suggestions.innerHTML = '';
})

let debounceTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query.length > 2) { 
            fetchMovieSuggestions(query);
        } else {
            suggestions.innerHTML = ''; 
        }
    }, 300);
});

function displayMovies(movies) {
    movieList.innerHTML = "";
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div')
        movieItem.classList.add('movie')
        movieItem.innerHTML =`<img src="${movie.Poster}" alt="${movie.Title}">`
        
        const movieInfo = document.createElement('div')
        movieInfo.classList.add('movie-info')

        movieInfo.innerHTML = `
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
            <button onclick="window.location.href='movieDetails.html?id=${movie.imdbID}'">More Info</button>
        `;

        movieItem.appendChild(movieInfo)
        movieList.appendChild(movieItem)
    });
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();

    if (query) {
        clearStoredMovies()
        fetchMovies(query)
    }

    suggestions.innerHTML = '';
})

// async function getMovieDetails(id) {
//     const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
//     const data = await response.json()
//     alert(`
//         Title: ${data.Title}
//         Year: ${data.Year}
//         Genre: ${data.Genre}
//         Plot: ${data.Plot}
//         `)
// }

// function addToFavorites(id, title, poster, year) {
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//     const isFavorite = favorites.some(movie => movie.id === id)

//     if (!isFavorite) {
//         favorites.push({id, title, poster, year})
//         localStorage.setItem('favorites', JSON.stringify(favorites))
//         alert(`${title} has been added to favorites!`)
//     }else {
//         alert(`${title} is already in your favorites!`)
//     }
// }

// function displayFavorites() {
//     const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//     movieList.innerHTML = '';

//     if (favorites.length === 0) {
//         movieList.innerHTML = `<p>No favorite movies added yet.</p>`
//         return
//     }

//     favorites.forEach(movie => {
//         const movieItem = document.createElement('div')
//         movieItem.classList.add('movie')
//         movieItem.innerHTML = `<img src="${movie.poster}" alt="${movie.title}">
//             <h3>${movie.title}</h3>
//             <p>Year: ${movie.year}</p>
//             <button onclick="removeFromFavorites('${movie.id}')">Remove from Favorites</button>
//             `;
//             movieList.appendChild(movieItem)
//     })
// }

// function removeFromFavorites(id) {
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || []
//     favorites = favorites.filter(movie => movie.id !== id)
//     localStorage.setItem('favorites', JSON.stringify(favorites))
//     displayFavorites()
// }

function setupPagination(query, totalResults, currentPage) {
    const totalPages = Math.ceil(totalResults / 10)
    const paginationDiv = document.createElement('div')
    paginationDiv.classList.add('pagination')

    if (currentPage > 1) {
        const prevButton = document.createElement('button')
        prevButton.innerText = `Previous`;
        prevButton.onclick = () => fetchMovies(query, currentPage - 1)
        paginationDiv.appendChild(prevButton)
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button')
        nextButton.innerText = 'Next';
        nextButton.onclick = () => fetchMovies(query, currentPage + 1)
        paginationDiv.appendChild(nextButton)
    }

    movieList.appendChild(paginationDiv)
}

function loadStoredMovies() {
    const query = localStorage.getItem('lastSearchQuery')
    const storedResults = localStorage.getItem('lastSearchResults')
    
    if (query && storedResults) {
        const movies = JSON.parse(storedResults)
        displayMovies(movies)
        setupPagination(query, movies.length, 1)
    }
}
window.addEventListener('load', loadStoredMovies)

function clearStoredMovies() {
    localStorage.removeItem('lastSearchQuery')
    localStorage.removeItem('lastSearchResults')
}