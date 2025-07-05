import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NeuronDisplay {
  x: number;
  y: number;
  layer: number;
  index: number;
  activation: number;
}

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
  // Neuron position tracking
  neuronPositions: Record<string, NeuronDisplay>;
  addNeuronPosition: (neuron: NeuronDisplay) => void;
  removeNeuronPositions: (layer: number) => void;
  clearAllNeuronPositions: () => void;
  // Animation weights
  weights: number[];
  setWeights: (w: number[]) => void;

  neuronWeights: number[];
  setNeuronWeights: (w: number[]) => void;
}

export const useActivationsStore = create<ActivationsState>()(
  persist(
    (set, get) => ({
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
      // Neuron position tracking
      neuronPositions: {},
      addNeuronPosition: (neuron: NeuronDisplay) => {
        const key = `${neuron.layer}-${neuron.index}`;
        set((state) => ({
          neuronPositions: { ...state.neuronPositions, [key]: neuron },
        }));
      },
      removeNeuronPositions: (layer: number) => {
        set((state) => {
          const newObj = { ...state.neuronPositions };
          for (const key of Object.keys(newObj)) {
            if (key.startsWith(`${layer}-`)) {
              delete newObj[key];
            }
          }
          return { neuronPositions: newObj };
        });
      },
      clearAllNeuronPositions: () => {
        set({ neuronPositions: {} });
      },
      // Animation weights
      weights: [0, 0, 0],
      setWeights: (w: number[]) => set({ weights: w }),

      neuronWeights: [0, 0, 0, 0],
      setNeuronWeights: (w: number[]) => set({ neuronWeights: w }),
    }),
    { name: "activations-storage" },
  ),
);
