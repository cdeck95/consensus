# Setting Up Real Movie/TV Data

This app can use real movie and TV show data from The Movie Database (TMDB) API instead of mock data.

## Quick Setup (5 minutes)

1. **Get a free TMDB API key:**

   - Go to https://www.themoviedb.org/signup
   - Create a free account
   - Go to Settings → API
   - Request an API key (choose "Developer" for free usage)

2. **Add your API key (choose one method):**

   **Option A: Environment Variable (Recommended)**

   - Copy `.env.example` to `.env`
   - Replace `your_actual_api_key_here` with your actual API key
   - Restart the Expo development server (`npx expo start --clear`)

   **Option B: Direct Configuration**

   - Open `config/tmdb.ts`
   - Replace `'YOUR_TMDB_API_KEY'` with your actual API key
   - Save the file

3. **That's it!** The app will automatically use real data instead of mock data.

## What you get with real data:

- ✅ Latest popular movies and TV shows
- ✅ Real posters and images
- ✅ Accurate ratings and descriptions
- ✅ Mix of trending content
- ✅ Fresh content updated daily

## Fallback behavior:

- If no API key is configured, the app uses mock data
- If the API is down, it falls back to mock data
- No app crashes - always works!

## API Usage:

- Free tier: 1,000 requests per day
- More than enough for typical app usage
- No credit card required

---

**Note:** The app works perfectly fine with mock data too, so adding the API key is optional but recommended for the best experience!
