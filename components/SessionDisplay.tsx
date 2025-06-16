import { Session } from "@/types";
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
const PADDING = Math.max(16, SCREEN_WIDTH * 0.04);

interface SessionDisplayProps {
  session: Session;
  onLeaveSession: () => void;
}

export const SessionDisplay: React.FC<SessionDisplayProps> = ({
  session,
  onLeaveSession,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Session Active</Text>
        <TouchableOpacity style={styles.leaveButton} onPress={onLeaveSession}>
          <Text style={styles.leaveButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Local Session</Text>
        <Text style={styles.code}>Pass & Play</Text>
      </View>

      <View style={styles.participantsContainer}>
        <Text style={styles.participantsLabel}>
          Participants ({session.participants.length})
        </Text>
        {session.participants.map((participant, index) => (
          <Text key={participant.id} style={styles.participant}>
            {index + 1}. {participant.name}
          </Text>
        ))}
      </View>

      <Text style={styles.instructions}>
        Everyone takes turns swiping on this device. When everyone likes the
        same show, we&apos;ll let you know! 🎯
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Math.max(16, SCREEN_HEIGHT * 0.02),
  },
  title: {
    fontSize: Math.max(16, Math.min(22, SCREEN_WIDTH * 0.05)),
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
    marginBottom: Math.max(16, SCREEN_HEIGHT * 0.02),
    padding: Math.max(12, SCREEN_WIDTH * 0.03),
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  codeLabel: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#666",
    marginBottom: 5,
  },
  code: {
    fontSize: Math.max(20, Math.min(28, SCREEN_WIDTH * 0.06)),
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 10,
  },
  participantsContainer: {
    marginBottom: Math.max(12, SCREEN_HEIGHT * 0.015),
  },
  participantsLabel: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  participant: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#666",
    paddingVertical: 2,
  },
  instructions: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: Math.max(16, SCREEN_WIDTH * 0.04),
  },
});
