import { Logo } from "@/components/Logo";
import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface TopicSelectionProps {
  onTopicSelect: (topic: string) => void;
}

export const TopicSelection: React.FC<TopicSelectionProps> = ({
  onTopicSelect,
}) => {
  const topics = [
    {
      id: "watch",
      title: "What to Watch",
      description: "Movies & TV Shows",
      icon: "🎬",
      color: Colors.brand.primary,
    },
    {
      id: "food",
      title: "Food",
      description: "Restaurants & Cuisine",
      icon: "🍽️",
      color: "#ff6b6b",
    },
    {
      id: "games",
      title: "What to Play",
      description: "Video Games",
      icon: "🎮",
      color: "#4ecdc4",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.header}>
          <Logo size="large" />
          <Text style={styles.title}>Choose Your Topic</Text>
          <Text style={styles.subtitle}>
            What would you like to find consensus on?
          </Text>
        </View>

        <View style={styles.topicsContainer}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicCard, { borderColor: topic.color }]}
              onPress={() => onTopicSelect(topic.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.topicIcon}>{topic.icon}</Text>
              <Text style={[styles.topicTitle, { color: topic.color }]}>
                {topic.title}
              </Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Select a topic to start building consensus with your group
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.05),
    paddingBottom: Math.max(30, SCREEN_HEIGHT * 0.04),
  },
  header: {
    alignItems: "center",
    marginBottom: Math.max(40, SCREEN_HEIGHT * 0.05),
  },
  title: {
    fontSize: Math.max(28, Math.min(36, SCREEN_WIDTH * 0.09)),
    fontWeight: "bold",
    color: Colors.brand.primary,
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Math.max(16, Math.min(18, SCREEN_WIDTH * 0.045)),
    color: "#666",
    textAlign: "center",
    lineHeight: Math.max(22, SCREEN_WIDTH * 0.055),
  },
  topicsContainer: {
    flex: 1,
    gap: Math.max(16, SCREEN_HEIGHT * 0.02),
    paddingVertical: 10,
    minHeight: Math.max(380, SCREEN_HEIGHT * 0.48), // Ensure minimum height for all cards
  },
  topicCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 2,
    padding: Math.max(24, SCREEN_WIDTH * 0.06),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: Math.max(120, SCREEN_HEIGHT * 0.15),
    justifyContent: "center",
  },
  topicIcon: {
    fontSize: Math.max(48, Math.min(64, SCREEN_WIDTH * 0.16)),
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.06)),
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  topicDescription: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    color: "#666",
    textAlign: "center",
  },
  footer: {
    marginTop: Math.max(20, SCREEN_HEIGHT * 0.03),
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    color: "#999",
    textAlign: "center",
    lineHeight: Math.max(20, SCREEN_WIDTH * 0.05),
  },
});
