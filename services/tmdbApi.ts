import axios from 'axios';
import { MediaTitle } from '@/types';

// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// You'll need to get your own API key from https://www.themoviedb.org/settings/api
// For now, we'll use a demo key (replace with your own)
const TMDB_API_KEY: string = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key

// TMDB API response interfaces
interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  runtime?: number;
  vote_average: number;
  overview: string;
  release_date: string;
}

interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  genre_ids: number[];
  episode_run_time?: number[];
  vote_average: number;
  overview: string;
  first_air_date: string;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Genre mapping cache
let genreMap: Map<number, string> | null = null;

// Create axios instance
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Fetch genre mapping
async function getGenreMap(): Promise<Map<number, string>> {
  if (genreMap) return genreMap;

  try {
    const [movieGenres, tvGenres] = await Promise.all([
      tmdbApi.get<{ genres: TMDBGenre[] }>('/genre/movie/list'),
      tmdbApi.get<{ genres: TMDBGenre[] }>('/genre/tv/list'),
    ]);

    genreMap = new Map();
    
    // Add movie genres
    movieGenres.data.genres.forEach(genre => {
      genreMap!.set(genre.id, genre.name);
    });
    
    // Add TV genres (avoiding duplicates)
    tvGenres.data.genres.forEach(genre => {
      if (!genreMap!.has(genre.id)) {
        genreMap!.set(genre.id, genre.name);
      }
    });

    return genreMap;
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    // Return a fallback map with some common genres
    genreMap = new Map([
      [28, 'Action'],
      [35, 'Comedy'],
      [18, 'Drama'],
      [27, 'Horror'],
      [878, 'Science Fiction'],
      [53, 'Thriller'],
      [16, 'Animation'],
      [10749, 'Romance'],
      [14, 'Fantasy'],
      [80, 'Crime'],
    ]);
    return genreMap;
  }
}

// Convert TMDB movie to our MediaTitle format
function convertMovieToMediaTitle(movie: TMDBMovie, genres: Map<number, string>): MediaTitle {
  const primaryGenre = movie.genre_ids[0] ? genres.get(movie.genre_ids[0]) || 'Unknown' : 'Unknown';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : undefined;
  
  return {
    id: `movie_${movie.id}`,
    title: movie.title,
    poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
    genre: primaryGenre,
    runtime: movie.runtime || 120, // Default to 120 minutes if not available
    rating: Math.round(movie.vote_average * 10) / 10,
    description: movie.overview,
    year,
  };
}

// Convert TMDB TV show to our MediaTitle format
function convertTVShowToMediaTitle(show: TMDBTVShow, genres: Map<number, string>): MediaTitle {
  const primaryGenre = show.genre_ids[0] ? genres.get(show.genre_ids[0]) || 'Unknown' : 'Unknown';
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined;
  const runtime = show.episode_run_time?.[0] || 45; // Default to 45 minutes if not available
  
  return {
    id: `tv_${show.id}`,
    title: show.name,
    poster_url: show.poster_path ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}` : '',
    genre: primaryGenre,
    runtime,
    rating: Math.round(show.vote_average * 10) / 10,
    description: show.overview,
    year,
  };
}

// Fetch popular movies
export async function getPopularMovies(page: number = 1): Promise<MediaTitle[]> {
  try {
    const [moviesResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBMovie>>('/movie/popular', { params: { page } }),
      getGenreMap(),
    ]);

    return moviesResponse.data.results
      .filter(movie => movie.poster_path) // Only include movies with posters
      .map(movie => convertMovieToMediaTitle(movie, genres));
  } catch (error) {
    console.error('Failed to fetch popular movies:', error);
    return [];
  }
}

// Fetch popular TV shows
export async function getPopularTVShows(page: number = 1): Promise<MediaTitle[]> {
  try {
    const [tvResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBTVShow>>('/tv/popular', { params: { page } }),
      getGenreMap(),
    ]);

    return tvResponse.data.results
      .filter(show => show.poster_path) // Only include shows with posters
      .map(show => convertTVShowToMediaTitle(show, genres));
  } catch (error) {
    console.error('Failed to fetch popular TV shows:', error);
    return [];
  }
}

// Fetch trending content (movies and TV shows)
export async function getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<MediaTitle[]> {
  try {
    const [response, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<(TMDBMovie | TMDBTVShow) & { media_type: 'movie' | 'tv' }>>(`/trending/all/${timeWindow}`),
      getGenreMap(),
    ]);

    return response.data.results
      .filter(item => item.poster_path) // Only include items with posters
      .map(item => {
        if (item.media_type === 'movie') {
          return convertMovieToMediaTitle(item as TMDBMovie, genres);
        } else {
          return convertTVShowToMediaTitle(item as TMDBTVShow, genres);
        }
      });
  } catch (error) {
    console.error('Failed to fetch trending content:', error);
    return [];
  }
}

// Get a mix of popular content (movies and TV shows)
export async function getMixedPopularContent(): Promise<MediaTitle[]> {
  try {
    const [movies, tvShows, trending] = await Promise.all([
      getPopularMovies(1),
      getPopularTVShows(1),
      getTrending('week'),
    ]);

    // Combine and shuffle the results
    const allContent = [...movies.slice(0, 7), ...tvShows.slice(0, 7), ...trending.slice(0, 6)];
    
    // Shuffle the array
    for (let i = allContent.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allContent[i], allContent[j]] = [allContent[j], allContent[i]];
    }

    return allContent;
  } catch (error) {
    console.error('Failed to fetch mixed content:', error);
    return [];
  }
}

// Search for movies and TV shows
export async function searchContent(query: string): Promise<MediaTitle[]> {
  try {
    const [response, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<(TMDBMovie | TMDBTVShow) & { media_type: 'movie' | 'tv' }>>('/search/multi', {
        params: { query },
      }),
      getGenreMap(),
    ]);

    return response.data.results
      .filter(item => item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv'))
      .map(item => {
        if (item.media_type === 'movie') {
          return convertMovieToMediaTitle(item as TMDBMovie, genres);
        } else {
          return convertTVShowToMediaTitle(item as TMDBTVShow, genres);
        }
      });
  } catch (error) {
    console.error('Failed to search content:', error);
    return [];
  }
}

// Check if API key is configured
export function isApiKeyConfigured(): boolean {
  return TMDB_API_KEY !== 'YOUR_TMDB_API_KEY' && typeof TMDB_API_KEY === 'string' && TMDB_API_KEY.length > 0;
}
