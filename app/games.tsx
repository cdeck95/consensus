import { Logo } from "@/components/Logo";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function GamesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Logo size="medium" />
        <Text style={styles.title}>Gaming Consensus</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>🎮</Text>
        <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
        <Text style={styles.comingSoonText}>
          Gaming consensus feature is currently in development.
          {"\n\n"}
          Soon you&apos;ll be able to swipe through video games to find what
          everyone wants to play together!
        </Text>

        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>🎯 Multiplayer games</Text>
          <Text style={styles.featureItem}>
            🏆 Single-player recommendations
          </Text>
          <Text style={styles.featureItem}>📱 Mobile games</Text>
          <Text style={styles.featureItem}>🖥️ PC & Console games</Text>
          <Text style={styles.featureItem}>🆓 Free-to-play options</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.brand.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: Math.max(28, Math.min(36, SCREEN_WIDTH * 0.09)),
    fontWeight: "bold",
    color: Colors.brand.primary,
    marginTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: Math.max(24, Math.min(32, SCREEN_WIDTH * 0.08)),
    fontWeight: "bold",
    color: Colors.brand.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: Math.max(16, Math.min(18, SCREEN_WIDTH * 0.045)),
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: Math.max(22, SCREEN_WIDTH * 0.055),
    marginBottom: 30,
  },
  featuresList: {
    alignItems: "flex-start",
    gap: 12,
  },
  featureItem: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    color: Colors.light.text,
    opacity: 0.8,
  },
});
