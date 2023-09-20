import React from 'react';
import Movie from './Movie';
import classes from './MoviesList.module.css';

const MoviesList = (props) => {
  const { movies, onDeleteMovie } = props;

  return (
    <ul className={classes['movies-list']}>
      {movies.map((movie) => (
        <li key={movie.id} className={classes['movie-item']}>
          <Movie
            title={movie.title}
            releaseDate={movie.releaseDate}
            openingText={movie.openingText}
          />
          <button onClick={() => onDeleteMovie(movie.id)}>Delete Movie</button>
        </li>
      ))}
    </ul>
  );
};

export default MoviesList;
