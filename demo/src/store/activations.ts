import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActivationsState {
  activations: number[];
  setActivations: (a: number[]) => void;
  resetActivations: () => void;
}

export const useActivationsStore = create<ActivationsState>()(
  persist(
    (set) => ({
      activations: Array(784).fill(0),
      setActivations: (a: number[]) =>
        set({ activations: a } as ActivationsState),
      resetActivations: () =>
        set({ activations: Array(784).fill(0) } as ActivationsState),
    }),
    { name: "activations-storage" },
  ),
);
