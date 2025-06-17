export interface MediaTitle {
  id: string;
  title: string;
  poster_url: string;
  genre: string;
  runtime: number;
  rating: number;
  description?: string;
  year?: number;
}

export interface Participant {
  id: string;
  name: string;
  hasCompleted: boolean;
}

export interface Session {
  id: string;
  created_at: string;
  status: "setup" | "swiping" | "completed";
  matched_title?: MediaTitle;
  participants: Participant[];
  currentParticipantIndex: number;
  totalParticipants: number;
  participantQueues?: Record<string, MediaTitle[]>; // Per-participant shuffled queues
}

export interface UserSwipe {
  id: string;
  session_id: string;
  participant_id: string;
  media_title_id: string;
  swipe_direction: "left" | "right";
  created_at: string;
}

export interface AppState {
  currentSession?: Session;
  mediaQueue: MediaTitle[];
  currentMediaIndex: number;
  userSwipes: UserSwipe[];
  isMatched: boolean;
  showSummary: boolean;
  sessionHistory: SessionHistory[];
}

export interface SessionHistory {
  sessionId: string;
  shownMediaIds: string[];
  createdAt: string;
}
