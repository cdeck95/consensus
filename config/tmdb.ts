// TMDB API Configuration
// Get your free API key at: https://www.themoviedb.org/settings/api

import Constants from "expo-constants";

export const TMDB_CONFIG = {
  API_KEY: Constants.expoConfig?.extra?.tmdbApiKey || "YOUR_TMDB_API_KEY",

  // Base URLs (no need to change these)
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",
};

export const isApiKeyConfigured = (): boolean => {
  return (
    TMDB_CONFIG.API_KEY !== undefined &&
    TMDB_CONFIG.API_KEY !== "YOUR_TMDB_API_KEY" &&
    TMDB_CONFIG.API_KEY.length > 0
  );
};
