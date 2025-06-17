import { Logo } from "@/components/Logo";
import { Colors } from "@/constants/Colors";
import { Participant } from "@/types";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallScreen = SCREEN_WIDTH < 375;
const PADDING = Math.max(16, SCREEN_WIDTH * 0.04);
const BUTTON_HEIGHT = Math.max(48, SCREEN_HEIGHT * 0.06);

interface SessionSetupProps {
  participants: Participant[];
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (id: string) => void;
  onStartSession: () => Promise<void>;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onStartSession,
}) => {
  const [participantName, setParticipantName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddParticipant = () => {
    const name = participantName.trim();
    if (name.length === 0) {
      Alert.alert("Error", "Please enter a name");
      return;
    }
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert("Error", "This name is already added");
      return;
    }
    onAddParticipant(name);
    setParticipantName("");
  };

  const handleStartSession = async () => {
    if (participants.length < 2) {
      Alert.alert(
        "Need More People",
        "You need at least 2 people to find consensus. Add more participants!",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Start Swiping?",
      `Ready to start with ${participants.length} people? You'll pass the phone around for everyone to swipe.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: async () => {
            setIsLoading(true);
            try {
              await onStartSession();
            } catch (error) {
              console.error("Error starting session:", error);
              Alert.alert("Error", "Failed to load content. Please try again.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Logo size="large" style={styles.logo} />

      <Text style={styles.title}>Who&apos;s Deciding?</Text>
      <Text style={styles.subtitle}>
        Add everyone who will help choose what to watch
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Add Person</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={participantName}
            onChangeText={setParticipantName}
            onSubmitEditing={handleAddParticipant}
            returnKeyType="done"
            accessibilityLabel="Participant name input"
            accessibilityHint="Enter the name of a person joining this session"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddParticipant}
            accessibilityLabel="Add participant"
            accessibilityHint="Add this person to the session"
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {participants.length > 0 && (
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>
            Participants ({participants.length})
          </Text>

          <View style={styles.participantsList}>
            {participants.map((participant, index) => (
              <View key={participant.id} style={styles.participantRow}>
                <Text style={styles.participantName}>
                  {index + 1}. {participant.name}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onRemoveParticipant(participant.id)}
                  accessibilityLabel={`Remove ${participant.name}`}
                  accessibilityHint="Remove this person from the session"
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.startButton,
          (participants.length < 2 || isLoading) && styles.disabledButton,
        ]}
        onPress={handleStartSession}
        disabled={participants.length < 2 || isLoading}
        accessibilityLabel="Start swiping session"
        accessibilityHint={
          participants.length < 2
            ? "Need at least 2 people to start"
            : "Begin the swiping session"
        }
      >
        <Text
          style={[
            styles.startButtonText,
            (participants.length < 2 || isLoading) && styles.disabledButtonText,
          ]}
        >
          {isLoading ? "Loading..." : "Start Swiping"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.instructions}>
        You&apos;ll pass the phone around for each person to swipe through
        shows. When everyone likes the same show, you&apos;ve found your match!
        🎬
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: PADDING,
    paddingBottom: Math.max(40, SCREEN_HEIGHT * 0.05),
  },
  logo: {
    marginBottom: Math.max(20, SCREEN_HEIGHT * 0.025),
    alignSelf: "center",
  },
  title: {
    fontSize: isSmallScreen
      ? 28
      : Math.max(28, Math.min(36, SCREEN_WIDTH * 0.08)),
    fontWeight: "bold",
    color: Colors.brand.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: isSmallScreen
      ? 16
      : Math.max(16, Math.min(20, SCREEN_WIDTH * 0.045)),
    color: "#666",
    textAlign: "center",
    marginBottom: Math.max(30, SCREEN_HEIGHT * 0.04),
    lineHeight: isSmallScreen ? 22 : 26,
  },
  inputContainer: {
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  label: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: Math.max(8, SCREEN_WIDTH * 0.02),
  },
  input: {
    flex: 1,
    height: BUTTON_HEIGHT,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    paddingHorizontal: Math.max(12, SCREEN_WIDTH * 0.03),
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    backgroundColor: "#fff",
    // Minimum touch target
    minHeight: 44,
  },
  addButton: {
    height: BUTTON_HEIGHT,
    paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.04),
    backgroundColor: "#4ECDC4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60, // Minimum width for accessibility
  },
  addButtonText: {
    color: "#fff",
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
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
    paddingVertical: Math.max(10, SCREEN_HEIGHT * 0.015),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 44, // Accessibility touch target
  },
  participantName: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    color: "#333",
    flex: 1,
  },
  removeButton: {
    paddingHorizontal: Math.max(10, SCREEN_WIDTH * 0.025),
    paddingVertical: Math.max(6, SCREEN_HEIGHT * 0.008),
    backgroundColor: "#ff4757",
    borderRadius: 6,
    minWidth: 44, // Accessibility
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: Math.max(12, Math.min(14, SCREEN_WIDTH * 0.032)),
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: Colors.brand.primary,
    paddingVertical: Math.max(12, SCREEN_HEIGHT * 0.018),
    borderRadius: 12,
    alignItems: "center",
    marginBottom: Math.max(16, SCREEN_HEIGHT * 0.02),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 48, // Accessibility
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
  instructions: {
    fontSize: Math.max(13, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
    lineHeight: Math.max(18, SCREEN_WIDTH * 0.045),
    paddingHorizontal: Math.max(10, SCREEN_WIDTH * 0.025),
  },
});
