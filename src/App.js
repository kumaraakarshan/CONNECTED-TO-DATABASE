import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryInterval, setRetryInterval] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://swapi.dev/api/films');
      if (!response.ok) {
        throw new Error('Failed to fetch movies. Retrying...');
      }
      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
      setIsLoading(false);
      setRetrying(false);
      clearInterval(retryInterval); // Clear the retry interval on success
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      console.error('Error fetching movies:', error);
      setRetrying(true); // Set retrying to true when an error occurs
    }
  }, [retryInterval]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const cancelRetryHandler = () => {
    setRetrying(false);
    clearInterval(retryInterval); // Clear the retry interval
    setIsLoading(false); // Reset the loading state
  };

  const fetchMoviesHandler = () => {
    fetchMovies();
  };

  const retryButtonDisabled = retrying || isLoading;

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={retryButtonDisabled}>
          Fetch Movies
        </button>
        {retrying && (
          <button onClick={cancelRetryHandler} disabled={isLoading}>
            Cancel Retry
          </button>
        )}
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>No Movies are there</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
