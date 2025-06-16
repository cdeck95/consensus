# Consensus - Swipe to Watch App 🎬

Like Tinder, but for deciding what to watch! A React Native app built with Expo that helps groups of friends reach consensus on what to watch by swiping through movies and TV shows.

## 🎯 Features

- **Pass-the-phone gameplay**: Local multiplayer experience - no accounts needed!
- **Tinder-style interface**: Swipe left (nope) or right (like) on shows and movies
- **Real-time consensus**: When everyone swipes right on the same title, it's a match!
- **Real movie/TV data**: Uses The Movie Database (TMDB) API for current content
- **Beautiful animations**: Smooth swipe animations and celebratory match reveals
- **Session summaries**: Post-game stats and insights
- **Responsive design**: Optimized for all phone sizes
- **Cross-platform**: Works on iOS, Android, and web via Expo

## 🚀 Getting Started

### Prerequisites

- Node.js (14 or newer)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (iOS/Android)

### Installation

1. Clone this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. **(Optional) Set up real movie data:**

   - See [TMDB_SETUP.md](TMDB_SETUP.md) for 5-minute setup
   - App works perfectly with mock data if you skip this step

4. Start the development server:

   ```bash
   npm start
   ```

5. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## 🎮 How to Use

1. **Add participants**: Enter names of everyone who will be swiping
2. **Start session**: Pass the phone around for each person to swipe
3. **Swipe**: Swipe left (👎) on shows you don't want, right (👍) on shows you'd watch
4. **Match or Try Again**: When everyone likes the same show, celebrate! If not, start fresh.
5. **Session summary**: View stats and start a new round
6. **Enjoy**: Time to watch your matched content! 🍿

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **API**: The Movie Database (TMDB) with fallback mock data
- **Animations**: React Native Reanimated
- **Navigation**: Expo Router
- **Gestures**: React Native Gesture Handler
- **HTTP Client**: Axios for API calls

## 📱 App Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Main app interface
│   ├── explore.tsx        # How it works guide
│   └── _layout.tsx        # Tab navigation
├── _layout.tsx            # Root layout
components/
├── SwipeCard.tsx          # Individual swipeable cards
├── SwipeDeck.tsx          # Stack of cards with gestures
├── MatchAnimation.tsx     # Success animation
├── SessionSetup.tsx       # Add participants interface
├── SessionSummary.tsx     # Post-session stats
├── TurnIndicator.tsx      # Shows whose turn it is
└── ActionButtons.tsx      # Like/Nope buttons
store/
└── appStore.ts           # Zustand state management
types/
└── index.ts              # TypeScript definitions
data/
└── mockData.ts           # Mock data with API integration
services/
└── tmdbApi.ts            # TMDB API service
config/
└── tmdb.ts               # API configuration
```

## 🔮 Current Status

✅ **Completed:**

- Full pass-the-phone local multiplayer
- TMDB API integration with fallback
- Responsive design for all phone sizes
- Match detection and animations
- Session summary with stats
- Accessibility support

🚧 **Future Features:**

- Real-time multiplayer (WebSocket/Supabase)
- Genre/service filtering
- User profiles and history
- Push notifications
- Advanced matching algorithms

## 🧪 Demo Mode

The app can run in two modes:

- **With TMDB API**: Real movie/TV data with posters and details
- **Mock Data Mode**: Sample content with placeholder images
- Automatically falls back to mock data if API is unavailable

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and pull requests! This is a fun project that could use:

- Better animations and transitions
- More comprehensive movie/show database
- Real backend integration
- UI/UX improvements
- Additional features from the roadmap

---

Made with ❤️ for movie night decisions! No more endless scrolling or arguments about what to watch.
