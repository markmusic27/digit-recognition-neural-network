import { useActivationsStore } from "~/store/activations";

interface LayerProps {
  neurons: number[];
  layer: number;
}

interface NeuronProps {
  activation: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const getBackgroundColor = (activation: number) => {
  // Convert activation (0-1) to opacity (0-255)
  const opacity = Math.round(activation * 255);
  return `rgba(255, 255, 255, ${activation})`;
};

const Neuron = ({ activation, onMouseEnter, onMouseLeave }: NeuronProps) => {
  return (
    <div
      className="h-[35px] w-[35px] rounded-full border-[1.5px] border-white transition-all duration-300 hover:scale-[1.05]"
      style={{ backgroundColor: getBackgroundColor(activation) }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0px 0px 10px 0px #949494";
        onMouseEnter();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        onMouseLeave();
      }}
    ></div>
  );
};

const Layer = ({ neurons, layer }: LayerProps) => {
  const { setHoveredActivation, resetHoveredActivation } =
    useActivationsStore();

  return (
    <div className="flex flex-col gap-[10px]">
      {neurons.map((act, i) => (
        <Neuron
          activation={act}
          key={i}
          onMouseEnter={() => setHoveredActivation(layer, i)}
          onMouseLeave={() => resetHoveredActivation()}
        />
      ))}
    </div>
  );
};

export default Layer;
