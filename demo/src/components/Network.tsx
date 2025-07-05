import Layer from "./Layer";

type NetworkProps = {
  width: number;
};

const Network = (props: NetworkProps) => {
  return (
    <div className="relative bg-red-900">
      <div className="flex items-center justify-center gap-[180px]">
        <Layer
          layer={0}
          isInput={true}
          neurons={Array.from({ length: 16 }, () => Math.random())}
        />
        <Layer
          layer={0}
          neurons={Array.from({ length: 16 }, () => Math.random())}
        />
        <Layer
          layer={0}
          neurons={Array.from({ length: 16 }, () => Math.random())}
        />
        <Layer
          layer={0}
          isOutput={true}
          neurons={Array.from({ length: 10 }, () => Math.random())}
        />
      </div>
    </div>
  );
};

export default Network;
