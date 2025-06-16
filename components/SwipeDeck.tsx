import { MediaTitle } from "@/types";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SwipeCard } from "./SwipeCard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive deck height that adapts to screen size
const DECK_HEIGHT = Math.min(SCREEN_HEIGHT * 0.75, 650);

interface SwipeDeckProps {
  mediaQueue: MediaTitle[];
  currentIndex: number;
  onSwipe: (mediaId: string, direction: "left" | "right") => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  mediaQueue,
  currentIndex,
  onSwipe,
}) => {
  const renderCards = () => {
    return mediaQueue
      .slice(currentIndex, currentIndex + 3) // Show current + next 2 cards
      .map((media, index) => {
        const cardIndex = currentIndex + index;
        const isTopCard = index === 0;

        return (
          <SwipeCard
            key={`${media.id}-${cardIndex}`}
            media={media}
            onSwipe={(direction) => onSwipe(media.id, direction)}
            isTopCard={isTopCard}
          />
        );
      })
      .reverse(); // Reverse so the top card is rendered last (on top)
  };

  return (
    <View style={styles.container}>
      <View style={styles.deck}>{renderCards()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Math.max(10, SCREEN_WIDTH * 0.025),
  },
  deck: {
    width: SCREEN_WIDTH * 0.9,
    height: DECK_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});
