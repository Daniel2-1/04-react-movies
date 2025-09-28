import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import toast from "react-hot-toast";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState(false);
  const [isLoaded, setLoader] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setError(false);
      setLoader(true);

      const result = await fetchMovies(query);
      if (result.length === 0) {
        toast.error("No movies found for your request.");
      }
      setMovies(result);
    } catch {
      setError(true);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <SearchBar onForm={handleSearch} />
      {error && <ErrorMessage />}
      {isLoaded && <Loader />}

      {!error && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}

export default App;
