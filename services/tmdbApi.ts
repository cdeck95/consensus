import { TMDB_CONFIG } from "@/config/tmdb";
import { MediaTitle } from "@/types";
import axios from "axios";

// TMDB API configuration
const TMDB_BASE_URL = TMDB_CONFIG.BASE_URL;
const TMDB_IMAGE_BASE_URL = TMDB_CONFIG.IMAGE_BASE_URL;
const TMDB_API_KEY = TMDB_CONFIG.API_KEY;

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
      tmdbApi.get<{ genres: TMDBGenre[] }>("/genre/movie/list"),
      tmdbApi.get<{ genres: TMDBGenre[] }>("/genre/tv/list"),
    ]);

    genreMap = new Map();

    // Add movie genres
    movieGenres.data.genres.forEach((genre) => {
      genreMap!.set(genre.id, genre.name);
    });

    // Add TV genres (avoiding duplicates)
    tvGenres.data.genres.forEach((genre) => {
      if (!genreMap!.has(genre.id)) {
        genreMap!.set(genre.id, genre.name);
      }
    });

    return genreMap;
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    // Return a fallback map with some common genres
    genreMap = new Map([
      [28, "Action"],
      [35, "Comedy"],
      [18, "Drama"],
      [27, "Horror"],
      [878, "Science Fiction"],
      [53, "Thriller"],
      [16, "Animation"],
      [10749, "Romance"],
      [14, "Fantasy"],
      [80, "Crime"],
    ]);
    return genreMap;
  }
}

// Helper to check if content is available for streaming (not too new)
function isStreamingAvailable(releaseDate: string): boolean {
  const release = new Date(releaseDate);
  const now = new Date();
  const daysDiff = (now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff > 45; // Released more than 45 days ago
}

// Convert TMDB movie to our MediaTitle format
function convertMovieToMediaTitle(
  movie: TMDBMovie,
  genres: Map<number, string>
): MediaTitle {
  const primaryGenre = movie.genre_ids[0]
    ? genres.get(movie.genre_ids[0]) || "Unknown"
    : "Unknown";
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : undefined;

  return {
    id: `movie_${movie.id}`,
    title: movie.title,
    poster_url: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : "",
    genre: primaryGenre,
    runtime: movie.runtime || 120, // Default to 120 minutes if not available
    rating: Math.round(movie.vote_average * 10) / 10,
    description: movie.overview,
    year,
  };
}

// Convert TMDB TV show to our MediaTitle format
function convertTVShowToMediaTitle(
  show: TMDBTVShow,
  genres: Map<number, string>
): MediaTitle {
  const primaryGenre = show.genre_ids[0]
    ? genres.get(show.genre_ids[0]) || "Unknown"
    : "Unknown";
  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : undefined;
  const runtime = show.episode_run_time?.[0] || 45; // Default to 45 minutes if not available

  return {
    id: `tv_${show.id}`,
    title: show.name,
    poster_url: show.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}`
      : "",
    genre: primaryGenre,
    runtime,
    rating: Math.round(show.vote_average * 10) / 10,
    description: show.overview,
    year,
  };
}

// Fetch popular movies (excluding in-theater releases)
export async function getPopularMovies(
  page: number = 1
): Promise<MediaTitle[]> {
  try {
    const [moviesResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBMovie>>("/movie/popular", {
        params: { page },
      }),
      getGenreMap(),
    ]);

    return moviesResponse.data.results
      .filter((movie) => {
        // Only include movies with posters and not currently in theaters
        return (
          movie.poster_path &&
          movie.release_date &&
          isStreamingAvailable(movie.release_date)
        );
      })
      .map((movie) => convertMovieToMediaTitle(movie, genres));
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

// Fetch popular TV shows
export async function getPopularTVShows(
  page: number = 1
): Promise<MediaTitle[]> {
  try {
    const [tvResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBTVShow>>("/tv/popular", {
        params: { page },
      }),
      getGenreMap(),
    ]);

    return tvResponse.data.results
      .filter((show) => show.poster_path) // Only include shows with posters
      .map((show) => convertTVShowToMediaTitle(show, genres));
  } catch (error) {
    console.error("Failed to fetch popular TV shows:", error);
    return [];
  }
}

// Fetch trending content (movies and TV shows, excluding in-theater movies)
export async function getTrending(
  timeWindow: "day" | "week" = "week"
): Promise<MediaTitle[]> {
  try {
    const [response, genres] = await Promise.all([
      tmdbApi.get<
        TMDBResponse<(TMDBMovie | TMDBTVShow) & { media_type: "movie" | "tv" }>
      >(`/trending/all/${timeWindow}`),
      getGenreMap(),
    ]);

    return response.data.results
      .filter((item) => {
        if (!item.poster_path) return false;

        // For movies, check if they're available for streaming
        if (item.media_type === "movie") {
          const movie = item as TMDBMovie;
          return movie.release_date && isStreamingAvailable(movie.release_date);
        }

        // TV shows are generally available for streaming
        return true;
      })
      .map((item) => {
        if (item.media_type === "movie") {
          return convertMovieToMediaTitle(item as TMDBMovie, genres);
        } else {
          return convertTVShowToMediaTitle(item as TMDBTVShow, genres);
        }
      });
  } catch (error) {
    console.error("Failed to fetch trending content:", error);
    return [];
  }
}

// Fetch top-rated movies (excluding in-theater releases)
export async function getTopRatedMovies(
  page: number = 1
): Promise<MediaTitle[]> {
  try {
    const [moviesResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBMovie>>("/movie/top_rated", {
        params: { page },
      }),
      getGenreMap(),
    ]);

    return moviesResponse.data.results
      .filter((movie) => {
        // Only include movies with posters and not currently in theaters
        return (
          movie.poster_path &&
          movie.release_date &&
          isStreamingAvailable(movie.release_date)
        );
      })
      .map((movie) => convertMovieToMediaTitle(movie, genres));
  } catch (error) {
    console.error("Failed to fetch top-rated movies:", error);
    return [];
  }
}

// Fetch top-rated TV shows
export async function getTopRatedTVShows(
  page: number = 1
): Promise<MediaTitle[]> {
  try {
    const [tvResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBTVShow>>("/tv/top_rated", {
        params: { page },
      }),
      getGenreMap(),
    ]);

    return tvResponse.data.results
      .filter((show) => show.poster_path) // Only include shows with posters
      .map((show) => convertTVShowToMediaTitle(show, genres));
  } catch (error) {
    console.error("Failed to fetch top-rated TV shows:", error);
    return [];
  }
}

// Fetch movies by genre
export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<MediaTitle[]> {
  try {
    const [moviesResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBMovie>>("/discover/movie", {
        params: {
          page,
          with_genres: genreId,
          sort_by: "vote_average.desc",
          "vote_count.gte": 100, // Ensure movies have enough votes
        },
      }),
      getGenreMap(),
    ]);

    return moviesResponse.data.results
      .filter((movie) => {
        return (
          movie.poster_path &&
          movie.release_date &&
          isStreamingAvailable(movie.release_date)
        );
      })
      .map((movie) => convertMovieToMediaTitle(movie, genres));
  } catch (error) {
    console.error("Failed to fetch movies by genre:", error);
    return [];
  }
}

// Fetch TV shows by genre
export async function getTVShowsByGenre(
  genreId: number,
  page: number = 1
): Promise<MediaTitle[]> {
  try {
    const [tvResponse, genres] = await Promise.all([
      tmdbApi.get<TMDBResponse<TMDBTVShow>>("/discover/tv", {
        params: {
          page,
          with_genres: genreId,
          sort_by: "vote_average.desc",
          "vote_count.gte": 50, // Ensure shows have enough votes
        },
      }),
      getGenreMap(),
    ]);

    return tvResponse.data.results
      .filter((show) => show.poster_path)
      .map((show) => convertTVShowToMediaTitle(show, genres));
  } catch (error) {
    console.error("Failed to fetch TV shows by genre:", error);
    return [];
  }
}

// Get random content from various genres
export async function getRandomGenreContent(): Promise<MediaTitle[]> {
  try {
    // Popular genre IDs for movies and TV shows
    const movieGenres = [28, 35, 18, 27, 878, 53, 16, 10749, 14, 80]; // Action, Comedy, Drama, Horror, Sci-Fi, Thriller, Animation, Romance, Fantasy, Crime
    const tvGenres = [18, 35, 80, 9648, 10759, 10765, 10766, 10767, 10768]; // Drama, Comedy, Crime, Mystery, Action & Adventure, Sci-Fi & Fantasy, Soap, Talk, War & Politics

    // Randomly select a few genres
    const selectedMovieGenres = movieGenres
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const selectedTVGenres = tvGenres
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const promises = [
      ...selectedMovieGenres.map((genreId) => getMoviesByGenre(genreId, 1)),
      ...selectedTVGenres.map((genreId) => getTVShowsByGenre(genreId, 1)),
    ];

    const results = await Promise.all(promises);
    const allContent = results.flat();

    // Return a random selection from the genre-based content
    return allContent.sort(() => 0.5 - Math.random()).slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch random genre content:", error);
    return [];
  }
}

// Helper function to remove duplicates based on title (case-insensitive)
function removeDuplicates(content: MediaTitle[]): MediaTitle[] {
  const seen = new Set<string>();
  return content.filter((item) => {
    const normalizedTitle = item.title.toLowerCase().trim();
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}

// Seeded random shuffle for consistent ordering per session
function seededShuffle<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  let hash = 0;

  // Create a simple hash from the seed
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use the hash as a seed for pseudo-random shuffling
  for (let i = shuffled.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff; // Linear congruential generator
    const j = hash % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Get a diverse mix of content with deduplication
export async function getMixedPopularContent(
  sessionSeed?: string,
  previouslyShownIds?: Set<string>
): Promise<MediaTitle[]> {
  try {
    const [
      popularMovies,
      topRatedMovies,
      popularTVShows,
      topRatedTVShows,
      randomGenreContent,
    ] = await Promise.all([
      getPopularMovies(1),
      getTopRatedMovies(1),
      getPopularTVShows(1),
      getTopRatedTVShows(1),
      getRandomGenreContent(),
    ]);

    // Create a balanced mix from different sources
    const allContent = [
      ...popularMovies.slice(0, 5), // 5 popular movies
      ...topRatedMovies.slice(0, 5), // 5 top-rated movies
      ...popularTVShows.slice(0, 5), // 5 popular TV shows
      ...topRatedTVShows.slice(0, 5), // 5 top-rated TV shows
      ...randomGenreContent.slice(0, 10), // 10 random genre-based selections
    ];

    // Remove duplicates
    let uniqueContent = removeDuplicates(allContent);

    // Filter out previously shown media if provided
    if (previouslyShownIds && previouslyShownIds.size > 0) {
      uniqueContent = uniqueContent.filter(
        (media) => !previouslyShownIds.has(media.id)
      );
    }

    // If we have a session seed, use seeded shuffle for consistent order
    if (sessionSeed) {
      return seededShuffle(uniqueContent, sessionSeed);
    }

    // Otherwise use random shuffle
    for (let i = uniqueContent.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueContent[i], uniqueContent[j]] = [
        uniqueContent[j],
        uniqueContent[i],
      ];
    }

    return uniqueContent;
  } catch (error) {
    console.error("Failed to fetch mixed content:", error);
    return [];
  }
}

// Search for movies and TV shows
export async function searchContent(query: string): Promise<MediaTitle[]> {
  try {
    const [response, genres] = await Promise.all([
      tmdbApi.get<
        TMDBResponse<(TMDBMovie | TMDBTVShow) & { media_type: "movie" | "tv" }>
      >("/search/multi", {
        params: { query },
      }),
      getGenreMap(),
    ]);

    return response.data.results
      .filter(
        (item) =>
          item.poster_path &&
          (item.media_type === "movie" || item.media_type === "tv")
      )
      .map((item) => {
        if (item.media_type === "movie") {
          return convertMovieToMediaTitle(item as TMDBMovie, genres);
        } else {
          return convertTVShowToMediaTitle(item as TMDBTVShow, genres);
        }
      });
  } catch (error) {
    console.error("Failed to search content:", error);
    return [];
  }
}
