import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

// функция для поиска фильмов по запросу
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await api.get("/search/movie", {
    params: { query },
  });
  return response.data.results;
};
