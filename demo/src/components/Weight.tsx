export interface WeightConnection {
  x: number;
  y: number;
  activation: number;
}

interface WeightProps {
  x1: number;
  y1: number;
  connections: WeightConnection[];
}

const Weight = (props: WeightProps) => {
  const { x1, y1, connections } = props;

  const getColor = (activation: number) => {
    const startColor = 0x616161;
    const endColor = 0xffffff;
    const interpolate = (start: number, end: number, factor: number) => {
      return Math.round(start + (end - start) * factor);
    };

    const r = interpolate(
      (startColor >> 16) & 0xff,
      (endColor >> 16) & 0xff,
      activation,
    );
    const g = interpolate(
      (startColor >> 8) & 0xff,
      (endColor >> 8) & 0xff,
      activation,
    );
    const b = interpolate(startColor & 0xff, endColor & 0xff, activation);

    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  return (
    <svg className="pointer-events-none absolute top-0 left-0 h-full w-full stroke-[1px]">
      {connections.map((connection, i) => (
        <line
          key={i}
          x1={props.x1}
          y1={props.y1}
          x2={connection.x}
          y2={connection.y}
          stroke={getColor(connection.activation)}
          style={{
            zIndex: connection.activation * 100,
            transition: "stroke 0.3s ease-in-out",
          }}
        />
      ))}
    </svg>
  );
};

export default Weight;
