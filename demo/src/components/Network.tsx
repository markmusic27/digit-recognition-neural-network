import { useActivationsStore } from "~/store/activations";
import Layer from "./Layer";

type NetworkProps = {
  width: number;
};

const Network = (props: NetworkProps) => {
  const { activations, hidden1, hidden2, output } = useActivationsStore();

  const formatActivations = (activations: number[]) => {
    const first8 = activations.slice(0, 8);
    const last8 = activations.slice(-8);
    const sublist = [...first8, ...last8];
    return sublist;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-[180px]">
        <Layer
          layer={0}
          isInput={true}
          neurons={formatActivations(activations)}
        />
        <Layer layer={0} neurons={hidden1} />
        <Layer layer={0} neurons={hidden2} />
        <Layer layer={0} isOutput={true} neurons={output} />
      </div>
    </div>
  );
};

export default Network;
