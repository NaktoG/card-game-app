import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionState = {
  nickname: string;
  setNickname: (nickname: string) => void;
  clearNickname: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      nickname: '',
      setNickname: (nickname) => set({ nickname: nickname.trim() }),
      clearNickname: () => set({ nickname: '' }),
    }),
    { name: 'card-game-session' },
  ),
);
