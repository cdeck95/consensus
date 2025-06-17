import "dotenv/config";

export default {
  expo: {
    name: "Consensus",
    slug: "consensus",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/cosensus_logo.png",
    scheme: "consensus",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/cosensus_logo.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/cosensus_logo.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/cosensus_logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      tmdbApiKey: process.env.TMDB_API_KEY,
    },
  },
};
