import { getRandomMediaQueue } from "@/data/mockData";
import { AppState, MediaTitle, Participant, Session, UserSwipe } from "@/types";
import { create } from "zustand";

interface AppStore extends AppState {
  // Actions
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  startSession: () => Promise<void>;
  swipeMedia: (mediaId: string, direction: "left" | "right") => Promise<void>;
  nextMedia: () => void;
  nextParticipant: () => void;
  resetApp: () => void;
  checkForMatch: () => Promise<void>;
  getCurrentParticipant: () => Participant | undefined;
  getMediaTitleById: (id: string) => MediaTitle | undefined;
  startNewSessionWithSameParticipants: () => Promise<void>;
  startNewSessionWithNewParticipants: () => void;
  showSessionSummary: () => void;
  continueAfterMatch: () => void;
  undoMatchAndContinue: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentSession: undefined,
  mediaQueue: [],
  currentMediaIndex: 0,
  userSwipes: [],
  isMatched: false,
  showSummary: false,

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

  startSession: async () => {
    const { currentSession } = get();
    if (!currentSession || currentSession.participants.length < 2) return;

    // Create base session seed
    const baseSessionSeed = currentSession.id;

    // Fetch base media queue
    const baseMediaQueue = await getRandomMediaQueue(baseSessionSeed);

    // Create per-participant shuffled queues using participant-specific seeds
    const participantQueues: Record<string, MediaTitle[]> = {};
    for (const participant of currentSession.participants) {
      const participantSeed = `${baseSessionSeed}_${participant.id}`;
      participantQueues[participant.id] = await getRandomMediaQueue(
        participantSeed
      );
    }

    const updatedSession: Session = {
      ...currentSession,
      status: "swiping",
      participantQueues,
    };

    // Set the current participant's queue as the main queue
    const currentParticipant =
      currentSession.participants[currentSession.currentParticipantIndex];
    const currentQueue =
      participantQueues[currentParticipant.id] || baseMediaQueue;

    set({
      currentSession: updatedSession,
      mediaQueue: currentQueue,
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
    const { currentSession, mediaQueue } = get();
    if (!currentSession) return;

    // Mark current participant as completed
    const updatedParticipants = currentSession.participants.map((p, index) =>
      index === currentSession.currentParticipantIndex
        ? { ...p, hasCompleted: true }
        : p
    );

    // Check if all participants have completed their swipes
    const allCompleted = updatedParticipants.every((p) => p.hasCompleted);

    if (allCompleted) {
      // All participants have completed - check for final match
      get().checkForMatch();

      // If no match was found, show summary
      setTimeout(() => {
        const { isMatched } = get();
        if (!isMatched) {
          set({ showSummary: true });
        }
      }, 100);
      return;
    }

    // Find next participant who hasn't completed
    const nextIndex =
      (currentSession.currentParticipantIndex + 1) %
      currentSession.totalParticipants;

    const updatedSession: Session = {
      ...currentSession,
      participants: updatedParticipants,
      currentParticipantIndex: nextIndex,
    };

    // Switch to the next participant's queue
    const nextParticipant = updatedParticipants[nextIndex];
    const nextQueue =
      currentSession.participantQueues?.[nextParticipant.id] || mediaQueue;

    set({
      currentSession: updatedSession,
      currentMediaIndex: 0, // Reset to beginning for next person
      mediaQueue: nextQueue, // Switch to next participant's shuffled queue
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

        // Show summary after match animation
        setTimeout(() => {
          set({ showSummary: true });
        }, 3000); // 3 seconds for animation
        return;
      }
    }
  },

  getCurrentParticipant: () => {
    const { currentSession } = get();
    if (!currentSession) return undefined;
    return currentSession.participants[currentSession.currentParticipantIndex];
  },

  getMediaTitleById: (id: string) => {
    const { mediaQueue } = get();
    return mediaQueue.find((media) => media.id === id);
  },

  resetApp: () => {
    set({
      currentSession: undefined,
      mediaQueue: [],
      currentMediaIndex: 0,
      userSwipes: [],
      isMatched: false,
      showSummary: false,
    });
  },

  startNewSessionWithSameParticipants: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    // Reset participants' completion status
    const resetParticipants = currentSession.participants.map((p) => ({
      ...p,
      hasCompleted: false,
    }));

    // Create new session with new ID for fresh seed
    const newSessionId = `session_${Date.now()}`;
    const baseSessionSeed = newSessionId;

    // Create per-participant shuffled queues with new seeds
    const participantQueues: Record<string, MediaTitle[]> = {};
    for (const participant of resetParticipants) {
      const participantSeed = `${baseSessionSeed}_${participant.id}`;
      participantQueues[participant.id] = await getRandomMediaQueue(
        participantSeed
      );
    }

    const newSession: Session = {
      ...currentSession,
      id: newSessionId,
      created_at: new Date().toISOString(),
      status: "swiping",
      participants: resetParticipants,
      currentParticipantIndex: 0,
      matched_title: undefined,
      participantQueues,
    };

    // Set the first participant's queue as the main queue
    const firstParticipant = resetParticipants[0];
    const currentQueue = participantQueues[firstParticipant.id] || [];

    set({
      currentSession: newSession,
      mediaQueue: currentQueue,
      currentMediaIndex: 0,
      userSwipes: [],
      isMatched: false,
      showSummary: false,
    });
  },

  startNewSessionWithNewParticipants: () => {
    set({
      currentSession: undefined,
      mediaQueue: [],
      currentMediaIndex: 0,
      userSwipes: [],
      isMatched: false,
      showSummary: false,
    });
  },

  showSessionSummary: () => {
    set({ showSummary: true });
  },

  continueAfterMatch: () => {
    const { currentSession, mediaQueue } = get();
    if (!currentSession) return;

    // Reset participants' completion status for this round
    const resetParticipants = currentSession.participants.map((p) => ({
      ...p,
      hasCompleted: false,
    }));

    // Remove the matched title from all participant queues
    const updatedParticipantQueues: Record<string, MediaTitle[]> = {};
    const matchedTitleId = currentSession.matched_title?.id;

    if (currentSession.participantQueues && matchedTitleId) {
      for (const [participantId, queue] of Object.entries(
        currentSession.participantQueues
      )) {
        updatedParticipantQueues[participantId] = queue.filter(
          (media) => media.id !== matchedTitleId
        );
      }
    }

    // Get the first participant's updated queue
    const firstParticipant = resetParticipants[0];
    const currentQueue =
      updatedParticipantQueues[firstParticipant.id] ||
      mediaQueue.filter((media) => media.id !== matchedTitleId);

    set({
      currentSession: {
        ...currentSession,
        participants: resetParticipants,
        currentParticipantIndex: 0,
        matched_title: undefined,
        status: "swiping",
        participantQueues: updatedParticipantQueues,
      },
      mediaQueue: currentQueue,
      currentMediaIndex: 0,
      isMatched: false,
    });
  },

  undoMatchAndContinue: () => {
    const { currentSession, userSwipes } = get();
    if (!currentSession || !currentSession.matched_title) return;

    // Remove the right swipes for the matched title from all participants
    const matchedTitleId = currentSession.matched_title.id;
    const filteredSwipes = userSwipes.filter(
      (swipe) =>
        !(
          swipe.media_title_id === matchedTitleId &&
          swipe.swipe_direction === "right"
        )
    );

    // Reset all participants' completion status except the current one
    const resetParticipants = currentSession.participants.map((p, index) => ({
      ...p,
      hasCompleted: index < currentSession.currentParticipantIndex,
    }));

    // Continue with the current participant's session
    set({
      currentSession: {
        ...currentSession,
        participants: resetParticipants,
        matched_title: undefined,
        status: "swiping",
      },
      userSwipes: filteredSwipes,
      isMatched: false,
    });
  },
}));
