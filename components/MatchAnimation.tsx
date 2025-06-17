import { Colors } from "@/constants/Colors";
import { MediaTitle } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  onKeepGoing?: () => void;
  onGoBack?: () => void; // New prop for going back
}

export const MatchAnimation: React.FC<MatchAnimationProps> = ({
  matchedTitle,
  onAnimationComplete,
  onKeepGoing,
  onGoBack,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);
  const [countdown, setCountdown] = useState(5);
  const [showButtons, setShowButtons] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

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
        // Show buttons after animation completes
        runOnJS(setShowButtons)(true);
      })
    );
  }, [confettiScale, opacity, scale]);

  // Countdown timer
  useEffect(() => {
    if (!showButtons || !timerActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Call onAnimationComplete after the countdown reaches 0
          setTimeout(() => {
            if (timerActive) {
              onAnimationComplete();
            }
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showButtons, timerActive, onAnimationComplete]);

  // Stop timer when user interacts
  const handleUserAction = (action: () => void) => {
    setTimerActive(false);
    action();
  };

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

        {/* Action buttons - only show if onKeepGoing is provided */}
        {onKeepGoing && showButtons && (
          <View style={styles.actionButtons}>
            <Text style={styles.countdownText}>
              {timerActive
                ? `Auto-continue in ${countdown}s`
                : "Choose an option:"}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.keepGoingButton}
                onPress={() => handleUserAction(onKeepGoing)}
              >
                <Text style={styles.keepGoingButtonText}>Keep Looking 🔍</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.finishButton}
                onPress={() => handleUserAction(onAnimationComplete)}
              >
                <Text style={styles.finishButtonText}>We&apos;re Done! ✅</Text>
              </TouchableOpacity>
            </View>

            {/* Go Back button - only show if onGoBack is provided */}
            {onGoBack && (
              <TouchableOpacity
                style={styles.goBackButton}
                onPress={() => handleUserAction(onGoBack)}
              >
                <Text style={styles.goBackButtonText}>
                  ← Go Back & Continue
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    color: Colors.brand.primary,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: Math.max(20, SCREEN_WIDTH * 0.05),
  },
  actionButtons: {
    marginTop: Math.max(20, SCREEN_HEIGHT * 0.025),
    width: "100%",
    alignItems: "center",
  },
  countdownText: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
    marginBottom: Math.max(12, SCREEN_HEIGHT * 0.015),
  },
  buttonRow: {
    flexDirection: "row",
    gap: Math.max(12, SCREEN_WIDTH * 0.03),
    width: "100%",
    justifyContent: "center",
  },
  keepGoingButton: {
    backgroundColor: Colors.brand.primary,
    paddingVertical: Math.max(10, SCREEN_HEIGHT * 0.012),
    paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.04),
    borderRadius: 25,
    flex: 1,
    maxWidth: 140,
  },
  keepGoingButtonText: {
    color: "#fff",
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    fontWeight: "600",
    textAlign: "center",
  },
  finishButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: Math.max(10, SCREEN_HEIGHT * 0.012),
    paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.04),
    borderRadius: 25,
    flex: 1,
    maxWidth: 140,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    fontWeight: "600",
    textAlign: "center",
  },
  goBackButton: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: Math.max(8, SCREEN_HEIGHT * 0.01),
    paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.05),
    borderRadius: 20,
    marginTop: Math.max(12, SCREEN_HEIGHT * 0.015),
  },
  goBackButtonText: {
    color: "#666",
    fontSize: Math.max(11, Math.min(14, SCREEN_WIDTH * 0.032)),
    fontWeight: "500",
    textAlign: "center",
  },
});
