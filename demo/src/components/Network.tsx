import { useActivationsStore } from "~/store/activations";
import Layer from "./Layer";
import { useEffect, useState } from "react";

type NetworkProps = {
  width: number;
};

const NETWORK_MAX_HEIGHT = 800;
const NETWORK_MAX_WIDTH = 711;
const NETWORK_MARGIN = 35; // px on each side
const NETWORK_HEIGHT_RATIO = 0.7; // 70% of screen height

function getNetworkScale(
  networkWidth: number,
  networkHeight: number,
  screenWidth: number,
  screenHeight: number,
) {
  // Cap network dimensions
  const cappedHeight = Math.min(
    networkHeight,
    NETWORK_MAX_HEIGHT,
    screenHeight * NETWORK_HEIGHT_RATIO,
  );
  const cappedWidth = Math.min(
    networkWidth,
    NETWORK_MAX_WIDTH,
    screenWidth - 2 * NETWORK_MARGIN,
  );

  // Calculate scale factors for each rule
  const heightScale = cappedHeight / networkHeight;
  const widthScale = cappedWidth / networkWidth;

  // Use the smallest scale to satisfy all constraints
  return Math.min(1, heightScale, widthScale);
}

const Network = (props: NetworkProps) => {
  const { activations, hidden1, hidden2, output } = useActivationsStore();
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 });

  // Assume these are the network's natural dimensions at scale 1
  const networkWidth = NETWORK_MAX_WIDTH;
  const networkHeight = NETWORK_MAX_HEIGHT;

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = getNetworkScale(
    networkWidth,
    networkHeight,
    screenSize.width,
    screenSize.height,
  );

  const formatActivations = (activations: number[]) => {
    const first8 = activations.slice(0, 8);
    const last8 = activations.slice(-8);
    const sublist = [...first8, ...last8];
    return sublist;
  };

  return (
    <div
      className="flex items-center justify-center gap-[180px]"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center",
        width: networkWidth,
        height: networkHeight,
        maxWidth: networkWidth,
        maxHeight: networkHeight,
      }}
    >
      <Layer
        layer={0}
        isInput={true}
        neurons={formatActivations(activations)}
      />
      <Layer layer={1} neurons={hidden1} />
      <Layer layer={2} neurons={hidden2} />
      <Layer layer={3} isOutput={true} neurons={output} />
    </div>
  );
};

export default Network;
