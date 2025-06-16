import { getRandomMediaQueue } from "@/data/mockData";
import { AppState, Participant, Session, UserSwipe } from "@/types";
import { create } from "zustand";

interface AppStore extends AppState {
  // Actions
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  startSession: () => void;
  swipeMedia: (mediaId: string, direction: "left" | "right") => Promise<void>;
  nextMedia: () => void;
  nextParticipant: () => void;
  resetApp: () => void;
  checkForMatch: () => Promise<void>;
  getCurrentParticipant: () => Participant | undefined;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentSession: undefined,
  mediaQueue: [],
  currentMediaIndex: 0,
  userSwipes: [],
  isMatched: false,

  // Actions
  addParticipant: (name: string) => {
    const newParticipant: Participant = {
      id: `participant_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 5)}`,
      name,
      hasCompleted: false,
    };

    const { currentSession } = get();
    if (!currentSession) {
      // Create new session
      const newSession: Session = {
        id: `session_${Date.now()}`,
        created_at: new Date().toISOString(),
        status: "setup",
        participants: [newParticipant],
        currentParticipantIndex: 0,
        totalParticipants: 1,
      };
      set({ currentSession: newSession });
    } else {
      // Add to existing session
      const updatedSession: Session = {
        ...currentSession,
        participants: [...currentSession.participants, newParticipant],
        totalParticipants: currentSession.totalParticipants + 1,
      };
      set({ currentSession: updatedSession });
    }
  },

  removeParticipant: (id: string) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedParticipants = currentSession.participants.filter(
      (p) => p.id !== id
    );

    if (updatedParticipants.length === 0) {
      set({ currentSession: undefined });
      return;
    }

    const updatedSession: Session = {
      ...currentSession,
      participants: updatedParticipants,
      totalParticipants: updatedParticipants.length,
      currentParticipantIndex: Math.min(
        currentSession.currentParticipantIndex,
        updatedParticipants.length - 1
      ),
    };
    set({ currentSession: updatedSession });
  },

  startSession: () => {
    const { currentSession } = get();
    if (!currentSession || currentSession.participants.length < 2) return;

    const updatedSession: Session = {
      ...currentSession,
      status: "swiping",
    };

    set({
      currentSession: updatedSession,
      mediaQueue: getRandomMediaQueue(),
      currentMediaIndex: 0,
      userSwipes: [],
      isMatched: false,
    });
  },

  swipeMedia: async (mediaId: string, direction: "left" | "right") => {
    const { currentSession, userSwipes } = get();
    if (!currentSession) return;

    const currentParticipant = get().getCurrentParticipant();
    if (!currentParticipant) return;

    const newSwipe: UserSwipe = {
      id: `swipe_${Date.now()}`,
      session_id: currentSession.id,
      participant_id: currentParticipant.id,
      media_title_id: mediaId,
      swipe_direction: direction,
      created_at: new Date().toISOString(),
    };

    const updatedSwipes = [...userSwipes, newSwipe];
    set({ userSwipes: updatedSwipes });

    // Check for match if it's a right swipe
    if (direction === "right") {
      await get().checkForMatch();
    }

    // Move to next media
    get().nextMedia();
  },

  nextMedia: () => {
    const { currentMediaIndex, mediaQueue } = get();
    if (currentMediaIndex < mediaQueue.length - 1) {
      set({ currentMediaIndex: currentMediaIndex + 1 });
    }
  },

  nextParticipant: () => {
    const { currentSession } = get();
    if (!currentSession) return;

    // Mark current participant as completed
    const updatedParticipants = currentSession.participants.map((p, index) =>
      index === currentSession.currentParticipantIndex
        ? { ...p, hasCompleted: true }
        : p
    );

    // Find next participant who hasn't completed
    let nextIndex =
      (currentSession.currentParticipantIndex + 1) %
      currentSession.totalParticipants;

    // If we've gone through everyone, check for consensus
    const allCompleted = updatedParticipants.every((p) => p.hasCompleted);
    if (allCompleted) {
      // Reset completion status for next round
      const resetParticipants = updatedParticipants.map((p) => ({
        ...p,
        hasCompleted: false,
      }));
      nextIndex = 0;

      const updatedSession: Session = {
        ...currentSession,
        participants: resetParticipants,
        currentParticipantIndex: nextIndex,
      };
      set({ currentSession: updatedSession });

      // Check for final match
      get().checkForMatch();
      return;
    }

    const updatedSession: Session = {
      ...currentSession,
      participants: updatedParticipants,
      currentParticipantIndex: nextIndex,
    };

    set({
      currentSession: updatedSession,
      currentMediaIndex: 0, // Reset to beginning for next person
    });
  },

  checkForMatch: async () => {
    const { userSwipes, mediaQueue, currentSession } = get();
    if (!currentSession) return;

    const totalParticipants = currentSession.participants.length;

    // Check each media title to see if all participants liked it
    for (const media of mediaQueue) {
      const likesForThisMedia = userSwipes.filter(
        (swipe) =>
          swipe.media_title_id === media.id && swipe.swipe_direction === "right"
      );

      // Get unique participants who liked this media
      const uniqueParticipantsWhoLiked = new Set(
        likesForThisMedia.map((swipe) => swipe.participant_id)
      );

      // If all participants liked this media, we have a match!
      if (uniqueParticipantsWhoLiked.size >= totalParticipants) {
        const updatedSession: Session = {
          ...currentSession,
          status: "completed",
          matched_title: media,
        };

        set({
          currentSession: updatedSession,
          isMatched: true,
        });
        return;
      }
    }
  },

  getCurrentParticipant: () => {
    const { currentSession } = get();
    if (!currentSession) return undefined;
    return currentSession.participants[currentSession.currentParticipantIndex];
  },

  resetApp: () => {
    set({
      currentSession: undefined,
      mediaQueue: [],
      currentMediaIndex: 0,
      userSwipes: [],
      isMatched: false,
    });
  },
}));
