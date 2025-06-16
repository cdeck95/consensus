import { Session } from "@/types";
import React from "react";
import {
  Alert,
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

interface PrepScreenProps {
  session: Session;
  onStartSession: () => void;
  onLeaveSession: () => void;
}

export const PrepScreen: React.FC<PrepScreenProps> = ({
  session,
  onStartSession,
  onLeaveSession,
}) => {
  const participantCount = session.participants.length;

  const handleStartSession = () => {
    if (participantCount < 2) {
      Alert.alert(
        "Need More Players",
        "You need at least 2 people to start a session. Add more participants!",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Start Session?",
      `Start swiping with ${participantCount} participants?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Start", onPress: onStartSession },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Session Prep</Text>
        <TouchableOpacity style={styles.leaveButton} onPress={onLeaveSession}>
          <Text style={styles.leaveButtonText}>Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Local Session</Text>
        <Text style={styles.code}>Pass & Play</Text>
        <Text style={styles.shareText}>
          Everyone will take turns on this device
        </Text>
      </View>

      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>
          Participants ({participantCount})
        </Text>

        <View style={styles.participantsList}>
          {session.participants.map((participant, index) => (
            <View key={participant.id} style={styles.participantRow}>
              <Text style={styles.participantText}>
                {index + 1}. {participant.name}
              </Text>
            </View>
          ))}
        </View>

        {participantCount < 2 && (
          <Text style={styles.waitingText}>
            Need at least 2 people to find consensus
          </Text>
        )}
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[
            styles.startButton,
            participantCount < 2 && styles.disabledButton,
          ]}
          onPress={handleStartSession}
          disabled={participantCount < 2}
        >
          <Text
            style={[
              styles.startButtonText,
              participantCount < 2 && styles.disabledButtonText,
            ]}
          >
            Start Session
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.instructions}>
        Each person will swipe through shows on this device. When everyone likes
        the same one, it&apos;s a match! 🎬
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: PADDING,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  title: {
    fontSize: isSmallScreen
      ? 20
      : Math.max(20, Math.min(28, SCREEN_WIDTH * 0.06)),
    fontWeight: "bold",
    color: "#333",
  },
  leaveButton: {
    paddingHorizontal: Math.max(12, SCREEN_WIDTH * 0.03),
    paddingVertical: Math.max(6, SCREEN_HEIGHT * 0.008),
    backgroundColor: "#ff4757",
    borderRadius: 8,
    minWidth: 44,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  leaveButtonText: {
    color: "#fff",
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    fontWeight: "600",
  },
  codeContainer: {
    alignItems: "center",
    marginBottom: Math.max(30, SCREEN_HEIGHT * 0.04),
    padding: Math.max(16, SCREEN_WIDTH * 0.04),
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  codeLabel: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    color: "#666",
    marginBottom: 8,
  },
  code: {
    fontSize: isSmallScreen
      ? 28
      : Math.max(28, Math.min(40, SCREEN_WIDTH * 0.09)),
    fontWeight: "bold",
    color: "#FF6B6B",
    letterSpacing: 6,
    marginBottom: 10,
  },
  shareText: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
  },
  participantsSection: {
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  sectionTitle: {
    fontSize: Math.max(16, Math.min(22, SCREEN_WIDTH * 0.05)),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  participantsList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: Math.max(12, SCREEN_WIDTH * 0.03),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  participantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Math.max(8, SCREEN_HEIGHT * 0.01),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 40,
  },
  participantText: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    color: "#333",
  },
  hostBadge: {
    fontSize: Math.max(10, Math.min(14, SCREEN_WIDTH * 0.03)),
    fontWeight: "bold",
    backgroundColor: "#4ECDC4",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  waitingText: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
  },
  actionsSection: {
    marginBottom: Math.max(16, SCREEN_HEIGHT * 0.02),
  },
  startButton: {
    backgroundColor: "#4ECDC4",
    paddingVertical: Math.max(12, SCREEN_HEIGHT * 0.018),
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 48,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  startButtonText: {
    color: "#fff",
    fontSize: Math.max(16, Math.min(20, SCREEN_WIDTH * 0.045)),
    fontWeight: "bold",
  },
  disabledButtonText: {
    color: "#999",
  },
  waitingContainer: {
    padding: Math.max(16, SCREEN_WIDTH * 0.04),
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  waitingForHostText: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    color: "#666",
    textAlign: "center",
  },
  instructions: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
    lineHeight: Math.max(18, SCREEN_WIDTH * 0.045),
    paddingHorizontal: Math.max(8, SCREEN_WIDTH * 0.02),
  },
});
