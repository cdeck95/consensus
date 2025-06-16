import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SessionCodeInputProps {
  onJoinSession: (code: string) => void;
  onCreateSession: () => void;
}

export const SessionCodeInput: React.FC<SessionCodeInputProps> = ({
  onJoinSession,
  onCreateSession,
}) => {
  const [sessionCode, setSessionCode] = useState("");

  const handleJoinSession = () => {
    if (sessionCode.trim().length === 0) {
      Alert.alert("Error", "Please enter a session code");
      return;
    }
    onJoinSession(sessionCode.trim().toUpperCase());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consensus</Text>
      <Text style={styles.subtitle}>Like Tinder, but for shows</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Join Session</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter session code"
          value={sessionCode}
          onChangeText={setSessionCode}
          autoCapitalize="characters"
          maxLength={6}
        />
        <TouchableOpacity style={styles.button} onPress={handleJoinSession}>
          <Text style={styles.buttonText}>Join Session</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.button, styles.createButton]}
        onPress={onCreateSession}
      >
        <Text style={[styles.buttonText, styles.createButtonText]}>
          Create New Session
        </Text>
      </TouchableOpacity>

      <Text style={styles.helpText}>
        Create a session and share the code with friends to start swiping
        together!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 50,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 2,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e1e5e9",
  },
  dividerText: {
    paddingHorizontal: 15,
    color: "#999",
    fontSize: 14,
  },
  createButton: {
    backgroundColor: "#4ECDC4",
    width: "100%",
    maxWidth: 300,
  },
  createButtonText: {
    color: "#fff",
  },
  helpText: {
    marginTop: 30,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
