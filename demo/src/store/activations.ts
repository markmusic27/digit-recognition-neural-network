import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActivationsState {
  activations: number[];
  setActivations: (a: number[]) => void;
  resetActivations: () => void;
  hoveredActivation: [number, number] | null;
  setHoveredActivation: (layer: number, index: number) => void;
  resetHoveredActivation: () => void;
}

export const useActivationsStore = create<ActivationsState>()(
  persist(
    (set) => ({
      activations: Array(784).fill(0),
      setActivations: (a: number[]) =>
        set({ activations: a } as ActivationsState),
      resetActivations: () =>
        set({ activations: Array(784).fill(0) } as ActivationsState),
      hoveredActivation: null,
      setHoveredActivation: (layer: number, index: number) =>
        set({ hoveredActivation: [layer, index] } as Partial<ActivationsState>),
      resetHoveredActivation: () =>
        set({ hoveredActivation: null } as Partial<ActivationsState>),
    }),
    { name: "activations-storage" },
  ),
);
