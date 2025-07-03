interface BlurProps {
  blur?: number;
  zIndex?: number;
  opacity?: number;
  top?: number;
}

const Blur = ({ blur = 0, zIndex = 0, opacity = 1, top = 0 }: BlurProps) => {
  return (
    <div
      className={`absolute left-1/2 z-[${zIndex}] -translate-x-1/2 opacity-[0.7] transition-all duration-600 md:opacity-[1]`}
      style={{ top: `${top}px` }}
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
