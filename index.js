document.addEventListener('DOMContentLoaded', () => {
  const filmsList = document.getElementById('films');
  const movieDetails = document.getElementById('movie-details');

  // Function to fetch and display movie list
  async function fetchMovies() {
    try {
      const response = await fetch('/films'); // Replace with actual endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const movies = await response.json();
      populateMoviesList(movies);
      showMovieDetails(movies[0]); // Display details of the first movie initially
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  // Function to populate movie list
  function populateMoviesList(movies) {
    filmsList.innerHTML = ''; // Clear placeholder <li>
    movies.forEach(movie => {
      const li = document.createElement('li');
      li.classList.add('film', 'item');
      li.textContent = movie.title;
      li.addEventListener('click', () => showMovieDetails(movie));
      filmsList.appendChild(li);
    });
  }

  // Function to display movie details
  function showMovieDetails(movie) {
    const { title, runtime, capacity, showtime, tickets_sold, description, poster } = movie;
    const availableTickets = capacity - tickets_sold;

    movieDetails.innerHTML = `
      <h3>${title}</h3>
      <p><strong>Runtime:</strong> ${runtime} minutes</p>
      <p><strong>Showtime:</strong> ${showtime}</p>
      <p><strong>Description:</strong> ${description}</p>
      <img class="movie-poster" src="${poster}" alt="Movie Poster">
      <p><strong>Available Tickets:</strong> ${availableTickets}</p>
      <button id="buy-ticket-btn" class="buy-ticket-btn" ${availableTickets === 0 ? 'disabled' : ''}>Buy Ticket</button>
    `;

    const buyTicketBtn = document.getElementById('buy-ticket-btn');
    buyTicketBtn.addEventListener('click', () => buyTicket(movie));
  }

  // Function to simulate buying a ticket
  function buyTicket(movie) {
    const { title, capacity, tickets_sold } = movie;
    const availableTickets = capacity - tickets_sold;

    if (availableTickets > 0) {
      movie.tickets_sold += 1; // Simulate ticket purchase
      showMovieDetails(movie); // Update movie details with new ticket count
    }
  }

  // Initialize by fetching movies
  fetchMovies();
});