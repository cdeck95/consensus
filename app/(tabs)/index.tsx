import { ActionButtons } from "@/components/ActionButtons";
import { MatchAnimation } from "@/components/MatchAnimation";
import { SessionSetup } from "@/components/SessionSetup";
import { SessionSummary } from "@/components/SessionSummary";
import { SwipeDeck } from "@/components/SwipeDeck";
import { TurnIndicator } from "@/components/TurnIndicator";
import { useAppStore } from "@/store/appStore";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const {
    currentSession,
    mediaQueue,
    currentMediaIndex,
    isMatched,
    showSummary,
    userSwipes,
    addParticipant,
    removeParticipant,
    startSession,
    swipeMedia,
    nextParticipant,
    resetApp,
    getCurrentParticipant,
    startNewSessionWithSameParticipants,
    startNewSessionWithNewParticipants,
  } = useAppStore();

  const handleSwipe = async (mediaId: string, direction: "left" | "right") => {
    await swipeMedia(mediaId, direction);
  };

  const handleButtonAction = (direction: "left" | "right") => {
    const currentMedia = mediaQueue[currentMediaIndex];
    if (currentMedia) {
      handleSwipe(currentMedia.id, direction);
    }
  };

  const handleMatchAnimationComplete = () => {
    // Animation completed, summary will be shown automatically via store timer
  };

  // Show session summary if showSummary state is true
  if (showSummary && currentSession) {
    return (
      <SafeAreaView style={styles.container}>
        <SessionSummary
          matchedTitle={currentSession.matched_title}
          participants={currentSession.participants}
          swipes={userSwipes}
          onNewSession={startNewSessionWithNewParticipants}
          onSameParticipants={startNewSessionWithSameParticipants}
          onBackToHome={resetApp}
        />
      </SafeAreaView>
    );
  }

  // Show match animation if there's a match
  if (isMatched && currentSession?.matched_title && !showSummary) {
    return (
      <SafeAreaView style={styles.container}>
        <MatchAnimation
          matchedTitle={currentSession.matched_title}
          onAnimationComplete={handleMatchAnimationComplete}
        />
      </SafeAreaView>
    );
  }

  // Show swiping interface if session is active
  if (currentSession?.status === "swiping" && mediaQueue.length > 0) {
    const currentParticipant = getCurrentParticipant();
    if (!currentParticipant) {
      return (
        <SafeAreaView style={styles.container}>
          <Text>Error: No current participant</Text>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <TurnIndicator
          currentParticipant={currentParticipant}
          participantNumber={currentSession.currentParticipantIndex + 1}
          totalParticipants={currentSession.totalParticipants}
          onEndTurn={nextParticipant}
          onResetSession={resetApp}
        />

        {currentMediaIndex < mediaQueue.length ? (
          <>
            <SwipeDeck
              mediaQueue={mediaQueue}
              currentIndex={currentMediaIndex}
              onSwipe={handleSwipe}
            />
            <ActionButtons
              onReject={() => handleButtonAction("left")}
              onLike={() => handleButtonAction("right")}
              disabled={false}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {currentParticipant.name} has finished swiping!
              {"\n"}Tap &quot;Done Swiping&quot; to pass to the next person.
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Show setup screen (default state)
  return (
    <SafeAreaView style={styles.container}>
      <SessionSetup
        participants={currentSession?.participants || []}
        onAddParticipant={addParticipant}
        onRemoveParticipant={removeParticipant}
        onStartSession={startSession}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Math.max(16, SCREEN_WIDTH * 0.04),
  },
  emptyText: {
    fontSize: Math.max(16, Math.min(20, SCREEN_WIDTH * 0.045)),
    color: "#666",
    textAlign: "center",
    lineHeight: Math.max(22, SCREEN_WIDTH * 0.055),
  },
});
