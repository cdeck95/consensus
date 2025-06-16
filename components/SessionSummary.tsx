import { useAppStore } from "@/store/appStore";
import { MediaTitle, Participant, UserSwipe } from "@/types";
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

// Responsive sizing
const isSmallScreen = SCREEN_WIDTH < 375;
const PADDING = Math.max(16, SCREEN_WIDTH * 0.04);

interface SessionSummaryProps {
  matchedTitle?: MediaTitle;
  participants: Participant[];
  swipes: UserSwipe[];
  onNewSession: () => void;
  onSameParticipants: () => Promise<void>;
  onBackToHome: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  matchedTitle,
  participants,
  swipes,
  onNewSession,
  onSameParticipants,
  onBackToHome,
}) => {
  const { getMediaTitleById } = useAppStore();
  // Calculate session statistics
  const totalSwipes = swipes.length;
  const rightSwipes = swipes.filter(
    (s) => s.swipe_direction === "right"
  ).length;
  const leftSwipes = swipes.filter((s) => s.swipe_direction === "left").length;

  // Calculate participant stats
  const participantStats = participants.map((participant) => {
    const participantSwipes = swipes.filter(
      (s) => s.participant_id === participant.id
    );
    const likes = participantSwipes.filter(
      (s) => s.swipe_direction === "right"
    ).length;
    const dislikes = participantSwipes.filter(
      (s) => s.swipe_direction === "left"
    ).length;

    return {
      name: participant.name,
      totalSwipes: participantSwipes.length,
      likes,
      dislikes,
      likePercentage:
        participantSwipes.length > 0
          ? (likes / participantSwipes.length) * 100
          : 0,
    };
  });

  // Get most liked shows (excluding the match if there is one)
  const showLikeCounts = swipes
    .filter((s) => s.swipe_direction === "right")
    .reduce((acc, swipe) => {
      acc[swipe.media_title_id] = (acc[swipe.media_title_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedShows = Object.entries(showLikeCounts)
    .filter(([mediaId]) => mediaId !== matchedTitle?.id)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {matchedTitle ? "🎉 Session Complete!" : "😔 No Match Found"}
      </Text>

      {matchedTitle ? (
        <View style={styles.matchSection}>
          <Text style={styles.matchTitle}>Your Match</Text>
          <View style={styles.matchCard}>
            <Text style={styles.showTitle}>{matchedTitle.title}</Text>
            <Text style={styles.showDetails}>
              {matchedTitle.genre} • {matchedTitle.runtime}min • ⭐{" "}
              {matchedTitle.rating}
            </Text>
            {matchedTitle.year && (
              <Text style={styles.showYear}>{matchedTitle.year}</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.noMatchSection}>
          <Text style={styles.noMatchText}>
            Unfortunately, no show got everyone&apos;s approval this time. But
            don&apos;t worry - you can try again with a fresh set of shows!
          </Text>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Session Stats</Text>
        <View style={styles.statCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Swipes:</Text>
            <Text style={styles.statValue}>{totalSwipes}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>👍 Likes:</Text>
            <Text style={styles.statValue}>{rightSwipes}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>👎 Passes:</Text>
            <Text style={styles.statValue}>{leftSwipes}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Participants:</Text>
            <Text style={styles.statValue}>{participants.length}</Text>
          </View>
        </View>
      </View>

      <View style={styles.participantStatsSection}>
        <Text style={styles.sectionTitle}>Participant Breakdown</Text>
        {participantStats.map((stat, index) => (
          <View key={index} style={styles.participantStatCard}>
            <Text style={styles.participantName}>{stat.name}</Text>
            <View style={styles.participantDetails}>
              <Text style={styles.participantStat}>
                {stat.likes} likes • {stat.dislikes} passes
              </Text>
              <Text style={styles.participantPercentage}>
                {stat.likePercentage.toFixed(0)}% approval rate
              </Text>
            </View>
          </View>
        ))}
      </View>

      {sortedShows.length > 0 && (
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Most Popular (Runner-ups)</Text>
          {sortedShows.map(([mediaId, count], index) => {
            const media = getMediaTitleById(mediaId);
            return (
              <View key={mediaId} style={styles.popularItem}>
                <Text style={styles.popularRank}>#{index + 1}</Text>
                <Text style={styles.popularTitle}>
                  {media?.title || "Unknown Title"}
                </Text>
                <Text style={styles.popularCount}>{count} likes</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={async () => {
            try {
              await onSameParticipants();
            } catch (error) {
              console.error("Error starting new session:", error);
            }
          }}
          accessibilityLabel="Play again with same people"
          accessibilityHint="Start a new session with the same participants"
        >
          <Text style={styles.primaryButtonText}>Play Again (Same Group)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onNewSession}
          accessibilityLabel="Start new session"
          accessibilityHint="Start completely fresh with new participants"
        >
          <Text style={styles.secondaryButtonText}>
            New Session (New People)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={onBackToHome}
          accessibilityLabel="Back to home"
          accessibilityHint="Return to the main screen"
        >
          <Text style={styles.tertiaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: isSmallScreen
      ? 24
      : Math.max(24, Math.min(32, SCREEN_WIDTH * 0.07)),
    fontWeight: "bold",
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  matchSection: {
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  matchTitle: {
    fontSize: Math.max(18, Math.min(24, SCREEN_WIDTH * 0.05)),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  matchCard: {
    backgroundColor: "#fff",
    padding: Math.max(16, SCREEN_WIDTH * 0.04),
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  showTitle: {
    fontSize: Math.max(18, Math.min(24, SCREEN_WIDTH * 0.05)),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  showDetails: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  showYear: {
    fontSize: Math.max(12, Math.min(14, SCREEN_WIDTH * 0.035)),
    color: "#999",
    textAlign: "center",
  },
  noMatchSection: {
    backgroundColor: "#fff",
    padding: Math.max(16, SCREEN_WIDTH * 0.04),
    borderRadius: 12,
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  noMatchText: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    color: "#666",
    textAlign: "center",
    lineHeight: Math.max(20, SCREEN_WIDTH * 0.05),
  },
  statsSection: {
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  sectionTitle: {
    fontSize: Math.max(16, Math.min(20, SCREEN_WIDTH * 0.045)),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: Math.max(16, SCREEN_WIDTH * 0.04),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Math.max(6, SCREEN_HEIGHT * 0.008),
  },
  statLabel: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    color: "#666",
  },
  statValue: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
    color: "#333",
  },
  participantStatsSection: {
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  participantStatCard: {
    backgroundColor: "#fff",
    padding: Math.max(12, SCREEN_WIDTH * 0.03),
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  participantName: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  participantDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantStat: {
    fontSize: Math.max(12, Math.min(14, SCREEN_WIDTH * 0.035)),
    color: "#666",
  },
  participantPercentage: {
    fontSize: Math.max(12, Math.min(14, SCREEN_WIDTH * 0.035)),
    color: "#4ECDC4",
    fontWeight: "600",
  },
  popularSection: {
    marginBottom: Math.max(25, SCREEN_HEIGHT * 0.03),
  },
  popularItem: {
    backgroundColor: "#fff",
    padding: Math.max(12, SCREEN_WIDTH * 0.03),
    borderRadius: 8,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  popularTitle: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  popularRank: {
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
    color: "#FF6B6B",
  },
  popularCount: {
    fontSize: Math.max(12, Math.min(14, SCREEN_WIDTH * 0.035)),
    color: "#666",
  },
  actionsSection: {
    gap: Math.max(12, SCREEN_HEIGHT * 0.015),
  },
  primaryButton: {
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
  primaryButtonText: {
    color: "#fff",
    fontSize: Math.max(16, Math.min(18, SCREEN_WIDTH * 0.04)),
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#FF6B6B",
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
  secondaryButtonText: {
    color: "#fff",
    fontSize: Math.max(16, Math.min(18, SCREEN_WIDTH * 0.04)),
    fontWeight: "bold",
  },
  tertiaryButton: {
    backgroundColor: "transparent",
    paddingVertical: Math.max(10, SCREEN_HEIGHT * 0.015),
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    minHeight: 44,
  },
  tertiaryButtonText: {
    color: "#666",
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    fontWeight: "600",
  },
});
