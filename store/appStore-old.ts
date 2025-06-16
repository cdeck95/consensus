import { getRandomMediaQueue } from "@/data/mockData";
import { AppState, Session, UserSwipe } from "@/types";
import { create } from "zustand";

interface AppStore extends AppState {
  // Actions
  createSession: () => Promise<void>;
  joinSession: (code: string) => Promise<void>;
  startSession: () => Promise<void>;
  swipeMedia: (mediaId: string, direction: "left" | "right") => Promise<void>;
  nextMedia: () => void;
  resetApp: () => void;
  checkForMatch: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentSession: undefined,
  currentUser: `user_${Math.random().toString(36).substr(2, 9)}`,
  mediaQueue: [],
  currentMediaIndex: 0,
  userSwipes: [],
  isMatched: false,

  // Actions
  createSession: async () => {
    const sessionCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    const currentUser = get().currentUser;
    const newSession: Session = {
      id: `session_${Date.now()}`,
      code: sessionCode,
      created_at: new Date().toISOString(),
      status: "prep",
      participants: [currentUser],
      host: currentUser,
    };

    set({
      currentSession: newSession,
      mediaQueue: [],
      currentMediaIndex: 0,
      userSwipes: [],
      isMatched: false,
    });
  },

  joinSession: async (code: string) => {
    // In a real app, this would fetch from the database
    // For demo, we'll simulate joining a session
    const currentUser = get().currentUser;
    const mockSession: Session = {
      id: `session_${Date.now()}`,
      code: code.toUpperCase(),
      created_at: new Date().toISOString(),
      status: "prep",
      participants: [currentUser, "other_user"],
      host: "other_user",
    };

    set({
      currentSession: mockSession,
      mediaQueue: [],
      currentMediaIndex: 0,
      userSwipes: [],
      isMatched: false,
    });
  },

  startSession: async () => {
    const { currentSession } = get();
    if (!currentSession || currentSession.status !== "prep") return;

    const updatedSession: Session = {
      ...currentSession,
      status: "active",
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
    const { currentSession, currentUser, userSwipes } = get();
    if (!currentSession) return;

    const newSwipe: UserSwipe = {
      id: `swipe_${Date.now()}`,
      session_id: currentSession.id,
      user_id: currentUser,
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

  checkForMatch: async () => {
    const { userSwipes, mediaQueue, currentMediaIndex, currentSession } = get();
    if (!currentSession) return;

    const currentMedia = mediaQueue[currentMediaIndex];
    if (!currentMedia) return;

    // Get all participants count
    const totalParticipants = currentSession.participants.length;
    
    // Get unique users who swiped right on current media
    const rightSwipesForCurrentMedia = userSwipes.filter(
      (swipe) =>
        swipe.media_title_id === currentMedia.id &&
        swipe.swipe_direction === "right"
    );
    
    // Get unique users (in case someone swiped multiple times somehow)
    const uniqueUsersWhoLiked = new Set(
      rightSwipesForCurrentMedia.map(swipe => swipe.user_id)
    );

    // Check if ALL participants have swiped right on this media
    if (uniqueUsersWhoLiked.size >= totalParticipants) {
      const updatedSession = {
        ...currentSession,
        status: "completed" as const,
        matched_title: currentMedia,
      };

      set({
        currentSession: updatedSession,
        isMatched: true,
      });
    }
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
