import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActivationsState {
  activations: number[];
  setActivations: (a: number[]) => void;
  hidden1: number[];
  setHidden1: (a: number[]) => void;
  hidden2: number[];
  setHidden2: (a: number[]) => void;
  output: number[];
  setOutput: (a: number[]) => void;
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
      hidden1: Array(128).fill(0),
      setHidden1: (a: number[]) => set({ hidden1: a } as ActivationsState),
      hidden2: Array(64).fill(0),
      setHidden2: (a: number[]) => set({ hidden2: a } as ActivationsState),
      output: Array(10).fill(0),
      setOutput: (a: number[]) => set({ output: a } as ActivationsState),
      hoveredActivation: null,
      setHoveredActivation: (layer: number, index: number) =>
        set({ hoveredActivation: [layer, index] } as Partial<ActivationsState>),
      resetHoveredActivation: () =>
        set({ hoveredActivation: null } as Partial<ActivationsState>),
    }),
    { name: "activations-storage" },
  ),
);
