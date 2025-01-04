import { create } from 'zustand';

export const useWinnerModal = create((set) => ({
  winnersModal: 'scale-0',
  show: (str: string) => set({ winnersModal: str }),
  hide: () => set({ winnersModal: 'scale-0' }),
}));

export const useGeneratorModal = create((set) => ({
  generatorModal: 'scale-0',
  show: (str: string) => set({ generatorModal: str }),
  hide: () => set({ generatorModal: 'scale-0' }),
}));
