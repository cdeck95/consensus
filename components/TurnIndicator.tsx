import { Participant } from "@/types";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallScreen = SCREEN_WIDTH < 375;
const PADDING = Math.max(16, SCREEN_WIDTH * 0.04);

interface TurnIndicatorProps {
  currentParticipant: Participant;
  participantNumber: number;
  totalParticipants: number;
  onEndTurn: () => void;
  onResetSession: () => void;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentParticipant,
  participantNumber,
  totalParticipants,
  onEndTurn,
  onResetSession,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.turnInfo}>
          <Text style={styles.turnLabel}>Now Swiping:</Text>
          <Text style={styles.participantName}>{currentParticipant.name}</Text>
          <Text style={styles.progress}>
            Person {participantNumber} of {totalParticipants}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={onResetSession}
          accessibilityLabel="Reset session"
          accessibilityHint="Start over with a new session"
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.endTurnButton}
        onPress={onEndTurn}
        accessibilityLabel="End turn"
        accessibilityHint="Pass the phone to the next person"
      >
        <Text style={styles.endTurnButtonText}>
          Done Swiping - Pass to Next Person
        </Text>
      </TouchableOpacity>

      <Text style={styles.instructions}>
        Swipe right on shows you&apos;d want to watch, left on ones you
        don&apos;t. When you&apos;re done, tap the button above to pass the
        phone.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Math.max(12, SCREEN_HEIGHT * 0.015),
  },
  turnInfo: {
    flex: 1,
  },
  turnLabel: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#666",
    marginBottom: 2,
  },
  participantName: {
    fontSize: isSmallScreen
      ? 20
      : Math.max(20, Math.min(28, SCREEN_WIDTH * 0.065)),
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 2,
  },
  progress: {
    fontSize: Math.max(10, Math.min(14, SCREEN_WIDTH * 0.03)),
    color: "#999",
  },
  resetButton: {
    paddingHorizontal: Math.max(12, SCREEN_WIDTH * 0.03),
    paddingVertical: Math.max(6, SCREEN_HEIGHT * 0.008),
    backgroundColor: "#ff4757",
    borderRadius: 8,
    minWidth: 44, // Accessibility
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    fontWeight: "600",
  },
  endTurnButton: {
    backgroundColor: "#4ECDC4",
    paddingVertical: Math.max(10, SCREEN_HEIGHT * 0.015),
    paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.04),
    borderRadius: 10,
    alignItems: "center",
    marginBottom: Math.max(8, SCREEN_HEIGHT * 0.01),
    minHeight: 48, // Accessibility
  },
  endTurnButtonText: {
    color: "#fff",
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
    textAlign: "center",
  },
  instructions: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#666",
    textAlign: "center",
    lineHeight: Math.max(16, SCREEN_WIDTH * 0.04),
    paddingHorizontal: Math.max(8, SCREEN_WIDTH * 0.02),
  },
});
