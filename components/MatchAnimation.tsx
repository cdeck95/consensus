import { MediaTitle } from "@/types";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallScreen = SCREEN_WIDTH < 375;
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 400);
const CARD_PADDING = Math.max(20, SCREEN_WIDTH * 0.05);

interface MatchAnimationProps {
  matchedTitle: MediaTitle;
  onAnimationComplete: () => void;
}

export const MatchAnimation: React.FC<MatchAnimationProps> = ({
  matchedTitle,
  onAnimationComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);

  useEffect(() => {
    // Start animation sequence
    opacity.value = withSpring(1);
    scale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 12 })
    );

    confettiScale.value = withDelay(
      300,
      withSpring(1, { damping: 8 }, () => {
        // Animation complete callback
        runOnJS(onAnimationComplete)();
      })
    );
  }, [confettiScale, onAnimationComplete, opacity, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confettiScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background overlay */}
      <View style={styles.overlay} />

      {/* Confetti effect */}
      <Animated.View style={[styles.confetti, confettiStyle]}>
        <Text style={styles.confettiEmoji}>🎉</Text>
        <Text style={styles.confettiEmoji}>🎊</Text>
        <Text style={styles.confettiEmoji}>✨</Text>
        <Text style={styles.confettiEmoji}>🌟</Text>
      </Animated.View>

      {/* Match card */}
      <Animated.View style={[styles.matchCard, cardStyle]}>
        <Text style={styles.matchTitle}>IT&apos;S A MATCH!</Text>

        <View style={styles.titleContainer}>
          <Text style={styles.showTitle}>{matchedTitle.title}</Text>
          <Text style={styles.showDetails}>
            {matchedTitle.genre} • {matchedTitle.runtime}min • ⭐{" "}
            {matchedTitle.rating}
          </Text>
          {matchedTitle.year && (
            <Text style={styles.showYear}>{matchedTitle.year}</Text>
          )}
        </View>

        <Text style={styles.celebrationText}>
          Everyone wants to watch this! 🍿
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  confetti: {
    position: "absolute",
    top: Math.max(80, SCREEN_HEIGHT * 0.12),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: Math.max(30, SCREEN_WIDTH * 0.08),
  },
  confettiEmoji: {
    fontSize: isSmallScreen
      ? 32
      : Math.max(32, Math.min(48, SCREEN_WIDTH * 0.1)),
  },
  matchCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: CARD_PADDING,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: Math.max(20, SCREEN_WIDTH * 0.05),
  },
  matchTitle: {
    fontSize: isSmallScreen
      ? 24
      : Math.max(24, Math.min(36, SCREEN_WIDTH * 0.08)),
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: Math.max(16, SCREEN_HEIGHT * 0.02),
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: Math.max(16, SCREEN_HEIGHT * 0.02),
  },
  showTitle: {
    fontSize: isSmallScreen
      ? 18
      : Math.max(18, Math.min(28, SCREEN_WIDTH * 0.06)),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  showDetails: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  showYear: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
  },
  celebrationText: {
    fontSize: Math.max(14, Math.min(20, SCREEN_WIDTH * 0.045)),
    color: "#4ECDC4",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: Math.max(20, SCREEN_WIDTH * 0.05),
  },
});
