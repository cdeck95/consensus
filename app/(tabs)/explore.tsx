import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallScreen = SCREEN_WIDTH < 375;
const PADDING = Math.max(16, SCREEN_WIDTH * 0.04);

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>How Consensus Works</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 The Goal</Text>
          <Text style={styles.text}>
            Find something to watch that everyone agrees on! No more endless
            scrolling or arguments about what to watch tonight.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👫 Add Everyone</Text>
          <Text style={styles.text}>
            Add the names of everyone who will help decide. No accounts or codes
            needed - just enter each person&apos;s name to get started.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Pass the Phone</Text>
          <Text style={styles.text}>
            Each person takes turns swiping on the same phone. When it&apos;s
            your turn, swipe through shows and pass the phone to the next person
            when done.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👈👉 Everyone Swipes</Text>
          <Text style={styles.text}>
            Each person gets the same shows but in a different random order.
            Swipe left (👎) on shows you don&apos;t want, swipe right (👍) on
            ones you&apos;d watch.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎉 Find Your Match!</Text>
          <Text style={styles.text}>
            When everyone has swiped right on the same show, you&apos;ve got a
            match! Perfect for your next movie night 🍿
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Tips</Text>
          <Text style={styles.text}>
            • Be generous with your right swipes for faster matches{"\n"}• Each
            person gets the same shows in different order{"\n"}• Use the action
            buttons if swiping is tricky{"\n"}• Perfect for date nights, family
            time, or friend groups
          </Text>
        </View>

        <Text style={styles.footer}>
          Made with ❤️ for movie night decisions
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: PADDING,
    paddingBottom: Math.max(30, SCREEN_HEIGHT * 0.04),
  },
  title: {
    fontSize: isSmallScreen
      ? 24
      : Math.max(24, Math.min(36, SCREEN_WIDTH * 0.08)),
    fontWeight: "bold",
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  section: {
    marginBottom: Math.max(20, SCREEN_HEIGHT * 0.025),
    backgroundColor: "#fff",
    padding: Math.max(16, SCREEN_WIDTH * 0.04),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: Math.max(16, Math.min(22, SCREEN_WIDTH * 0.05)),
    fontWeight: "bold",
    color: "#333",
    marginBottom: Math.max(8, SCREEN_HEIGHT * 0.01),
  },
  text: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    color: "#666",
    lineHeight: Math.max(20, SCREEN_WIDTH * 0.05),
  },
  footer: {
    fontSize: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
    marginTop: Math.max(16, SCREEN_HEIGHT * 0.02),
    fontStyle: "italic",
    paddingHorizontal: Math.max(8, SCREEN_WIDTH * 0.02),
  },
});
