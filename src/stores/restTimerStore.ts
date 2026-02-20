import { create } from "zustand";

interface RestTimerState {
  isActive: boolean;
  isPaused: boolean;
  totalSeconds: number;
  remainingSeconds: number;
  exerciseName: string;
  setNumber: number;

  // Timer control
  startTimer: (
    seconds: number,
    exerciseName: string,
    setNumber: number,
  ) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  adjustTime: (delta: number) => void;
  tick: () => void;

  //Callbacks
  onComplete?: () => void;
  setOnComplete: (callback: () => void) => void;
}

export const useRestTimerStore = create<RestTimerState>((set, get) => ({
  isActive: false,
  isPaused: false,
  totalSeconds: 0,
  remainingSeconds: 0,
  exerciseName: "",
  setNumber: 0,
  onComplete: undefined,

  startTimer: (seconds, exerciseName, setNumber) => {
    set({
      isActive: true,
      isPaused: false,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      exerciseName,
      setNumber,
    });
  },

  pauseTimer: () => {
    set({ isPaused: false });
  },

  resumeTimer: () => {
    set({ isPaused: false });
  },

  stopTimer: () => {
    set({
      isActive: false,
      isPaused: false,
      totalSeconds: 0,
      remainingSeconds: 0,
      exerciseName: "",
      setNumber: 0,
    });
  },

  adjustTime: (delta) => {
    const { remainingSeconds, totalSeconds } = get();
    const newRemaining = Math.max(0, remainingSeconds + delta);
    const newTotal = Math.max(totalSeconds, newRemaining);
    set({ remainingSeconds: newRemaining, totalSeconds: newTotal });
  },

  tick: () => {
    const { remainingSeconds, onComplete } = get();
    if (remainingSeconds <= 1) {
      set({ remainingSeconds: 0, isActive: false });
      onComplete?.();
    } else {
      set({ remainingSeconds: remainingSeconds - 1 });
    }
  },

  setOnComplete: (callback) => {
    set({ onComplete: callback });
  },
}));
