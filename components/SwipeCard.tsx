import { MediaTitle } from "@/types";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Responsive card dimensions based on screen size - optimized for better centering
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.65, 600); // Reduced from 0.75 to give more room
const POSTER_HEIGHT_RATIO = 0.7;

interface SwipeCardProps {
  media: MediaTitle;
  onSwipe: (direction: "left" | "right") => void;
  isTopCard: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  media,
  onSwipe,
  isTopCard,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isTopCard ? 1 : 0.95);
  const opacity = useSharedValue(isTopCard ? 1 : 0.3);

  // Update opacity and scale when isTopCard changes
  useEffect(() => {
    opacity.value = withSpring(isTopCard ? 1 : 0.3);
    scale.value = withSpring(isTopCard ? 1 : 0.95);
  }, [isTopCard, opacity, scale]);

  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: () => {
        if (!isTopCard) return;
      },
      onActive: (event) => {
        if (!isTopCard) return;
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      },
      onEnd: (event) => {
        if (!isTopCard) return;
        const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
        const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

        if (shouldSwipeLeft) {
          translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
          runOnJS(onSwipe)("left");
        } else if (shouldSwipeRight) {
          translateX.value = withSpring(SCREEN_WIDTH * 1.5);
          runOnJS(onSwipe)("right");
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      },
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-30, 0, 30],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const leftOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: media.poster_url }} style={styles.poster} />

        {/* Swipe Overlays */}
        <Animated.View
          style={[styles.overlay, styles.leftOverlay, leftOverlayStyle]}
        >
          <Text style={styles.overlayText}>NOPE</Text>
        </Animated.View>

        <Animated.View
          style={[styles.overlay, styles.rightOverlay, rightOverlayStyle]}
        >
          <Text style={styles.overlayText}>LIKE</Text>
        </Animated.View>

        <View style={styles.info}>
          <Text style={styles.title}>{media.title}</Text>
          <Text style={styles.details}>
            {media.genre} • {media.runtime}min • ⭐ {media.rating}
          </Text>
          {media.year && <Text style={styles.year}>{media.year}</Text>}
          {media.description && (
            <Text style={styles.description} numberOfLines={2}>
              {media.description}
            </Text>
          )}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    position: "absolute",
  },
  poster: {
    width: "100%",
    height: `${POSTER_HEIGHT_RATIO * 100}%`,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  info: {
    padding: Math.min(20, SCREEN_WIDTH * 0.05), // Responsive padding
    flex: 1,
  },
  title: {
    fontSize: Math.min(24, SCREEN_WIDTH * 0.06), // Responsive font size
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  details: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    color: "#666",
    marginBottom: 4,
  },
  year: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    color: "#999",
    marginBottom: 8,
  },
  description: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    color: "#555",
    lineHeight: Math.min(20, SCREEN_WIDTH * 0.05),
  },
  overlay: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.08, // Responsive positioning
    padding: Math.min(10, SCREEN_WIDTH * 0.025),
    borderRadius: 10,
    zIndex: 1,
  },
  leftOverlay: {
    left: 20,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    transform: [{ rotate: "-15deg" }],
  },
  rightOverlay: {
    right: 20,
    backgroundColor: "rgba(0, 255, 0, 0.8)",
    transform: [{ rotate: "15deg" }],
  },
  overlayText: {
    fontSize: Math.min(24, SCREEN_WIDTH * 0.06),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
