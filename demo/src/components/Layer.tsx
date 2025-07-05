import { useActivationsStore } from "~/store/activations";
import Dots from "./Dots";

interface LayerProps {
  neurons: number[];
  layer: number;
  isInput?: boolean;
  isOutput?: boolean;
}

interface NeuronProps {
  activation: number;
  isOutput?: boolean;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const getBackgroundColor = (activation: number) => {
  // Convert activation (0-1) to opacity (0-255)
  const opacity = Math.round(activation * 255);
  return `rgba(255, 255, 255, ${activation})`;
};

const Neuron = ({
  activation,
  onMouseEnter,
  onMouseLeave,
  index,
  isOutput = false,
}: NeuronProps) => {
  return (
    <div className="flex flex-row items-center">
      <div
        className="h-[40px] w-[40px] rounded-full border-[1.5px] border-white transition-all duration-300 hover:scale-[1.05]"
        style={{ backgroundColor: getBackgroundColor(activation) }}
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
  const { setHoveredActivation, resetHoveredActivation } =
    useActivationsStore();

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
                onMouseEnter={() => setHoveredActivation(layer, i)}
                onMouseLeave={() => resetHoveredActivation()}
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
            isOutput={isOutput}
            onMouseEnter={() => setHoveredActivation(layer, i)}
            onMouseLeave={() => resetHoveredActivation()}
          />
        );
      })}
    </div>
  );
};

export default Layer;
