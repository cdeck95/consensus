import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive button sizing - minimum 60px for accessibility, scale with screen
const BUTTON_SIZE = Math.max(60, Math.min(80, SCREEN_WIDTH * 0.18));
const BUTTON_GAP = Math.max(30, SCREEN_WIDTH * 0.08);

interface ActionButtonsProps {
  onReject: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onReject,
  onLike,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.rejectButton,
          disabled && styles.disabled,
        ]}
        onPress={onReject}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityLabel="Reject this show"
        accessibilityHint="Swipe left or tap to reject"
      >
        <Text style={styles.rejectText}>👎</Text>
        <Text style={styles.buttonLabel}>Nope</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.likeButton, disabled && styles.disabled]}
        onPress={onLike}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityLabel="Like this show"
        accessibilityHint="Swipe right or tap to like"
      >
        <Text style={styles.likeText}>👍</Text>
        <Text style={styles.buttonLabel}>Like</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Math.max(20, SCREEN_HEIGHT * 0.025),
    paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.05),
    gap: BUTTON_GAP,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    // Minimum touch target for accessibility
    minWidth: 44,
    minHeight: 44,
  },
  rejectButton: {
    backgroundColor: "#ff4757",
  },
  likeButton: {
    backgroundColor: "#2ed573",
  },
  disabled: {
    opacity: 0.5,
  },
  rejectText: {
    fontSize: Math.max(20, Math.min(28, SCREEN_WIDTH * 0.06)),
    marginBottom: 2,
  },
  likeText: {
    fontSize: Math.max(20, Math.min(28, SCREEN_WIDTH * 0.06)),
    marginBottom: 2,
  },
  buttonLabel: {
    fontSize: Math.max(10, Math.min(14, SCREEN_WIDTH * 0.03)),
    color: "#fff",
    fontWeight: "600",
  },
});
