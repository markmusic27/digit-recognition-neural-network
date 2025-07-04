import Layer from "./Layer";

type NetworkProps = {
  width: number;
};

const Network = (props: NetworkProps) => {
  const originalSize = 710;

  return (
    <div className="flex items-center justify-center">
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
        neurons={Array.from({ length: 16 }, () => Math.random())}
      />
      <Layer
        layer={0}
        neurons={Array.from({ length: 10 }, () => Math.random())}
      />
    </div>
  );
};

export default Network;
