interface BlurProps {
  blur?: number;
  zIndex?: number;
  opacity?: number;
}

const Blur = ({ blur = 0, zIndex = 0, opacity = 1 }: BlurProps) => {
  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[${zIndex}] opacity-[${opacity}]`}
    >
      <img
        src="/images/color.webp"
        className="h-[280px] w-[280px]"
        style={{ filter: `blur(${blur}px)` }}
      />
    </div>
  );
};

export default Blur;
