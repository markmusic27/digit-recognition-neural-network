interface WeightProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  activation: number;
  z: number;
}

const Weight = (props: WeightProps) => {
  return (
    <svg className="pointer-events-none absolute top-0 left-0 h-full w-full stroke-red-500 stroke-[10px]">
      <line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} />
    </svg>
  );
};

export default Weight;
