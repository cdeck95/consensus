# Consensus - Swipe to Watch App 🎬

Like Tinder, but for deciding what to watch! A React Native app built with Expo that helps groups of friends reach consensus on what to watch by swiping through movies and TV shows.

## 🎯 Features

- **Session-based swiping**: Create or join sessions with friends using simple codes
- **Tinder-style interface**: Swipe left (nope) or right (like) on shows and movies
- **Real-time consensus**: When everyone swipes right on the same title, it's a match!
- **Beautiful animations**: Smooth swipe animations and celebratory match reveals
- **Randomized queues**: Each user gets a different random order of content
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

3. Start the development server:

   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## 🎮 How to Use

1. **Create or Join**: Start a new session or join with a 6-character code
2. **Share**: Share your session code with friends
3. **Swipe**: Swipe left (👎) on shows you don't want, right (👍) on shows you'd watch
4. **Match**: When everyone likes the same show, you get a celebration and reveal!
5. **Enjoy**: Time to watch your matched content! 🍿

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Animations**: React Native Reanimated
- **Navigation**: Expo Router
- **Gestures**: React Native Gesture Handler
- **Backend Ready**: Set up for Supabase integration

## 📱 App Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Main swipe interface
│   ├── explore.tsx        # How it works guide
│   └── _layout.tsx        # Tab navigation
├── _layout.tsx            # Root layout
components/
├── SwipeCard.tsx          # Individual swipeable cards
├── SwipeDeck.tsx          # Stack of cards
├── MatchAnimation.tsx     # Success animation
├── SessionCodeInput.tsx   # Session creation/joining
├── SessionDisplay.tsx     # Session info header
└── ActionButtons.tsx      # Like/Nope buttons
store/
└── appStore.ts           # Zustand state management
types/
└── index.ts              # TypeScript definitions
data/
└── mockData.ts           # Sample movie/show data
```

## 🔮 Future Features

- **Real-time sync**: Full Supabase integration for live updates
- **TMDB Integration**: Real movie/show data and posters
- **Genre filtering**: Filter by genre, runtime, rating
- **Streaming service filters**: Filter by Netflix, Disney+, etc.
- **Session stats**: Fun post-match statistics
- **Profile system**: Save preferences and history
- **Push notifications**: Notify when sessions have matches

## 🧪 Demo Mode

Currently runs in demo mode with:

- Mock movie/show data with placeholder images
- Simulated real-time behavior
- Local state management
- Match triggers after 2+ right swipes (adjustable)

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
