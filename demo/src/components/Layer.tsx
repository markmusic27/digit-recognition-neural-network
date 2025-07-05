import { useActivationsStore } from "~/store/activations";
import Dots from "./Dots";
import { useEffect, useRef } from "react";

interface LayerProps {
  neurons: number[];
  layer: number;
  isInput?: boolean;
  isOutput?: boolean;
}

interface NeuronDisplay {
  x: number;
  y: number;
  layer: number;
  index: number;
  activation: number;
}

interface NeuronProps {
  activation: number;
  isOutput?: boolean;
  index: number;
  layer: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  neuronRef: (el: HTMLDivElement | null) => void;
}

const getBackgroundColor = (
  activation: number,
  weights: number[],
  layer: number,
) => {
  let w: number = weights[layer] === undefined ? 1 : weights[layer];

  // Blends black and white based on activation
  const gray = Math.round(255 * activation * w);
  return `rgba(${gray}, ${gray}, ${gray}, 1)`;
};

const Neuron = ({
  activation,
  onMouseEnter,
  onMouseLeave,
  index,
  layer,
  isOutput = false,
  neuronRef,
}: NeuronProps) => {
  const { neuronWeights } = useActivationsStore();

  return (
    <div className="flex flex-row items-center">
      <div
        ref={neuronRef}
        className="h-[40px] w-[40px] rounded-full border-[1.5px] border-white transition-all duration-300 hover:scale-[1.05]"
        style={{
          backgroundColor: getBackgroundColor(activation, neuronWeights, layer),
          transition: "background-color 0.3s ease-in-out",
        }}
        onMouseEnter={(e) => {
          onMouseEnter();
        }}
        onMouseLeave={(e) => {
          onMouseLeave();
        }}
      ></div>
      {isOutput ? (
        <p className="font-louize ml-[20px] text-[30px]">{index}</p>
      ) : null}
    </div>
  );
};

const Layer = ({ neurons, layer, isInput, isOutput }: LayerProps) => {
  const {
    setHoveredActivation,
    resetHoveredActivation,
    addNeuronPosition,
    removeNeuronPositions,
  } = useActivationsStore();

  const neuronRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to update neuron positions
  const updateNeuronPositions = () => {
    neurons.forEach((activation, index) => {
      const element = neuronRefs.current[index];
      if (element) {
        const rect = element.getBoundingClientRect();
        const neuron: NeuronDisplay = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          layer,
          index,
          activation,
        };
        addNeuronPosition(neuron);
      }
    });
  };

  // Update positions when neurons change or component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateNeuronPositions, 0);

    // Handler for window resize
    const handleResize = () => {
      updateNeuronPositions();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [neurons, layer]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      removeNeuronPositions(layer);
    };
  }, [layer, removeNeuronPositions]);

  const setNeuronRef = (index: number) => (el: HTMLDivElement | null) => {
    neuronRefs.current[index] = el;
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {neurons.map((act, i) => {
        if (isInput && i === Math.floor((neurons.length - 1) / 2)) {
          console.log(i);
          return (
            <div key={i}>
              <Neuron
                activation={act}
                key={i}
                index={i}
                layer={layer}
                onMouseEnter={() => setHoveredActivation(layer, i)}
                onMouseLeave={() => resetHoveredActivation()}
                neuronRef={setNeuronRef(i)}
              />
              <div className="h-[10px]" />
              <Dots />
            </div>
          );
        }

        return (
          <Neuron
            activation={act}
            key={i}
            index={i}
            layer={layer}
            isOutput={isOutput}
            onMouseEnter={() => setHoveredActivation(layer, i)}
            onMouseLeave={() => resetHoveredActivation()}
            neuronRef={setNeuronRef(i)}
          />
        );
      })}
    </div>
  );
};

export default Layer;
