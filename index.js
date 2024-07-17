// Function to fetch movies data from JSON server
async function fetchMovies() {
  try {
    const response = await fetch('http://localhost:3000/films');
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

// Function to display movie details
async function displayMovieDetails(movie) {
  const { id, title, runtime, showtime, tickets_sold, capacity, description, poster } = movie;

  const movieDetailsElement = document.getElementById('movie-details');
  movieDetailsElement.innerHTML = `
    <img src="${poster}" alt="${title} Poster">
    <h2>${title}</h2>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Runtime:</strong> ${runtime} mins</p>
    <p><strong>Showtime:</strong> ${showtime}</p>
    <p><strong>Tickets Available:</strong> ${capacity - tickets_sold}</p>
    <button id="buy-ticket">${tickets_sold === capacity ? 'Sold Out' : 'Buy Ticket'}</button>
  `;

  const buyTicketButton = document.getElementById('buy-ticket');
  buyTicketButton.addEventListener('click', async () => {
    if (tickets_sold < capacity) {
      // Simulate ticket purchase (update UI only)
      tickets_sold++;
      const updatedMovie = { ...movie, tickets_sold }; // Update the tickets_sold count
      updateUI(updatedMovie); // Update UI with updated movie details
    }
  });

  // Update UI based on movie details
  function updateUI(movie) {
    movieDetailsElement.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title} Poster">
      <h2>${movie.title}</h2>
      <p><strong>Description:</strong> ${movie.description}</p>
      <p><strong>Runtime:</strong> ${movie.runtime} mins</p>
      <p><strong>Showtime:</strong> ${movie.showtime}</p>
      <p><strong>Tickets Available:</strong> ${movie.capacity - movie.tickets_sold}</p>
      <button id="buy-ticket">${movie.tickets_sold === movie.capacity ? 'Sold Out' : 'Buy Ticket'}</button>
    `;

    if (movie.tickets_sold === movie.capacity) {
      buyTicketButton.disabled = true;
      const filmItem = document.querySelector(`li[data-id="${movie.id}"]`);
      filmItem.classList.add('sold-out');
    }
  }
}

// Function to populate movie list
async function populateMovieList() {
  const movies = await fetchMovies();
  const filmsListElement = document.getElementById('films');
  filmsListElement.innerHTML = movies.map(movie => `<li class="film-item" data-id="${movie.id}">${movie.title}</li>`).join('');

  filmsListElement.addEventListener('click', async (event) => {
    if (event.target.matches('.film-item')) {
      const selectedMovie = movies.find(movie => movie.id === event.target.dataset.id);
      await displayMovieDetails(selectedMovie);
    }
  });
}

// Initialize the application
async function init() {
  await populateMovieList();
  if (document.querySelector('.film-item')) {
    const firstMovieId = document.querySelector('.film-item').dataset.id;
    const firstMovieResponse = await fetch(`http://localhost:3000/films/${firstMovieId}`);
    const firstMovie = await firstMovieResponse.json();
    await displayMovieDetails(firstMovie);
  }
}

init();
