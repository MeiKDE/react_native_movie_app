// BASE_URL: This is the starting point for every TMDB request.
// API_KEY: Your secret key (stored securely in .env) to prove to
// TMDB that your app is allowed to access data.
// headers: These are settings that go with every request to tell TMDB:
// "I want JSON data"
// "Here’s my secret token (Bearer token)"

// TMDB_CONFIG	Stores shared settings for API requests
// fetchMovies({ query })	Searches for a movie (if query) or lists popular ones
// fetchMovieDetails(movieId)	Gets full details for a specific movie

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

//This function will eventually give me a list of movies, but I have to wait for it.
export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

//This function will eventually give me details about one movie, but I have to wait for it.
export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching movie details:", err);
    throw err;
  }
};
