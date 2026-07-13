import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsState = {
  soundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    { name: 'card-game-settings' },
  ),
);
