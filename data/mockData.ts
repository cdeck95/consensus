import { isApiKeyConfigured } from "@/config/tmdb";
import { getMixedPopularContent } from "@/services/tmdbApi";
import { MediaTitle } from "@/types";

export const mockMediaTitles: MediaTitle[] = [
  {
    id: "1",
    title: "The Mandalorian",
    poster_url:
      "https://via.placeholder.com/300x450/4A90E2/ffffff?text=The+Mandalorian",
    genre: "Sci-Fi",
    runtime: 45,
    rating: 8.7,
    description: "A bounty hunter in the outer reaches of the galaxy.",
    year: 2019,
  },
  {
    id: "2",
    title: "Stranger Things",
    poster_url:
      "https://via.placeholder.com/300x450/E94B3C/ffffff?text=Stranger+Things",
    genre: "Horror",
    runtime: 55,
    rating: 8.8,
    description: "Kids in a small town face supernatural forces.",
    year: 2016,
  },
  {
    id: "3",
    title: "The Office",
    poster_url:
      "https://via.placeholder.com/300x450/F5A623/ffffff?text=The+Office",
    genre: "Comedy",
    runtime: 22,
    rating: 9.0,
    description: "Mockumentary about office workers.",
    year: 2005,
  },
  {
    id: "4",
    title: "Breaking Bad",
    poster_url:
      "https://via.placeholder.com/300x450/7ED321/ffffff?text=Breaking+Bad",
    genre: "Drama",
    runtime: 47,
    rating: 9.5,
    description: "A chemistry teacher turns to crime.",
    year: 2008,
  },
  {
    id: "5",
    title: "The Crown",
    poster_url:
      "https://via.placeholder.com/300x450/BD10E0/ffffff?text=The+Crown",
    genre: "Drama",
    runtime: 60,
    rating: 8.6,
    description: "The reign of Queen Elizabeth II.",
    year: 2016,
  },
  {
    id: "6",
    title: "Avatar: The Last Airbender",
    poster_url: "https://via.placeholder.com/300x450/50E3C2/ffffff?text=Avatar",
    genre: "Animation",
    runtime: 24,
    rating: 9.3,
    description: "A young airbender saves the world.",
    year: 2005,
  },
  {
    id: "7",
    title: "Ted Lasso",
    poster_url:
      "https://via.placeholder.com/300x450/F8E71C/ffffff?text=Ted+Lasso",
    genre: "Comedy",
    runtime: 30,
    rating: 8.8,
    description: "An American football coach in England.",
    year: 2020,
  },
  {
    id: "8",
    title: "Game of Thrones",
    poster_url:
      "https://via.placeholder.com/300x450/8B572A/ffffff?text=Game+of+Thrones",
    genre: "Fantasy",
    runtime: 57,
    rating: 9.2,
    description: "Noble families fight for the Iron Throne.",
    year: 2011,
  },
  {
    id: "9",
    title: "The Witcher",
    poster_url:
      "https://via.placeholder.com/300x450/417505/ffffff?text=The+Witcher",
    genre: "Fantasy",
    runtime: 60,
    rating: 8.2,
    description: "A monster hunter in a magical world.",
    year: 2019,
  },
  {
    id: "10",
    title: "Friends",
    poster_url:
      "https://via.placeholder.com/300x450/9013FE/ffffff?text=Friends",
    genre: "Comedy",
    runtime: 22,
    rating: 8.9,
    description: "Six friends living in New York.",
    year: 1994,
  },
];

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

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random media queue with API data if available, fallback to mock data
export async function getRandomMediaQueue(
  sessionSeed?: string
): Promise<MediaTitle[]> {
  try {
    // Check if API key is configured
    if (isApiKeyConfigured()) {
      console.log("Using TMDB API for media data...");
      const apiData = await getMixedPopularContent(sessionSeed);

      if (apiData.length > 0) {
        return apiData; // Already shuffled in getMixedPopularContent
      }

      console.log("API returned no data, falling back to mock data");
    } else {
      console.log(
        "TMDB API key not configured, using mock data. Get your free API key at https://www.themoviedb.org/settings/api"
      );
    }
  } catch (error) {
    console.error("Error fetching from API, falling back to mock data:", error);
  }

  // Fallback to mock data with seeded shuffle if provided
  if (sessionSeed) {
    return seededShuffle(mockMediaTitles, sessionSeed);
  }

  return shuffleArray(mockMediaTitles);
}

// Synchronous version for backward compatibility (returns mock data)
export function getRandomMediaQueueSync(): MediaTitle[] {
  return shuffleArray(mockMediaTitles);
}
