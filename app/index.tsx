import { Logo } from "@/components/Logo";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallScreen = SCREEN_WIDTH < 375;
const PADDING = Math.max(20, SCREEN_WIDTH * 0.05);

interface TopicOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

const topicOptions: TopicOption[] = [
  {
    id: "watch",
    title: "What to Watch",
    description: "Movies & TV Shows",
    icon: "🎬",
    route: "/(tabs)",
  },
  {
    id: "food",
    title: "Food",
    description: "Restaurants & Recipes",
    icon: "🍕",
    route: "/food",
  },
  {
    id: "games",
    title: "What to Play",
    description: "Video Games",
    icon: "🎮",
    route: "/games",
  },
];

export default function TopicSelectionScreen() {
  const handleTopicSelect = (topic: TopicOption) => {
    router.push(topic.route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.header}>
          <Logo size="large" />
          {/* <Text style={styles.title}>Consensus</Text> */}
          <Text style={styles.subtitle}>
            Choose what you&apos;d like to find consensus on
          </Text>
        </View>

        <View style={styles.topicsContainer}>
          {topicOptions.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicCard}
              onPress={() => handleTopicSelect(topic)}
              accessibilityLabel={`Select ${topic.title}`}
              accessibilityHint={`Find consensus on ${topic.description}`}
            >
              <Text style={styles.topicIcon}>{topic.icon}</Text>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Swipe together, decide together</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: PADDING,
    paddingTop: Math.max(40, SCREEN_HEIGHT * 0.05),
    paddingBottom: Math.max(30, SCREEN_HEIGHT * 0.04),
  },
  title: {
    fontSize: isSmallScreen
      ? 32
      : Math.max(32, Math.min(48, SCREEN_WIDTH * 0.12)),
    fontWeight: "bold",
    color: Colors.brand.primary,
    marginTop: Math.max(16, SCREEN_HEIGHT * 0.02),
    marginBottom: Math.max(8, SCREEN_HEIGHT * 0.01),
  },
  subtitle: {
    fontSize: Math.max(16, Math.min(20, SCREEN_WIDTH * 0.045)),
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: Math.max(22, SCREEN_WIDTH * 0.055),
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  topicsContainer: {
    paddingHorizontal: PADDING,
    paddingVertical: Math.max(20, SCREEN_HEIGHT * 0.025),
    gap: Math.max(20, SCREEN_HEIGHT * 0.025),
    flexGrow: 1,
    justifyContent: "center",
  },
  topicCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: Math.max(24, SCREEN_WIDTH * 0.06),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: Math.max(120, SCREEN_HEIGHT * 0.15),
    justifyContent: "center",
  },
  topicIcon: {
    fontSize: Math.max(48, Math.min(64, SCREEN_WIDTH * 0.15)),
    marginBottom: Math.max(12, SCREEN_HEIGHT * 0.015),
  },
  topicTitle: {
    fontSize: Math.max(20, Math.min(28, SCREEN_WIDTH * 0.065)),
    fontWeight: "bold",
    color: Colors.brand.primary,
    marginBottom: Math.max(8, SCREEN_HEIGHT * 0.01),
    textAlign: "center",
  },
  topicDescription: {
    fontSize: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.04)),
    color: Colors.light.text,
    textAlign: "center",
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: PADDING,
    paddingBottom: Math.max(40, SCREEN_HEIGHT * 0.05),
    paddingTop: Math.max(20, SCREEN_HEIGHT * 0.025),
    alignItems: "center",
  },
  footerText: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.035)),
    color: Colors.light.text,
    fontStyle: "italic",
    opacity: 0.7,
  },
});
