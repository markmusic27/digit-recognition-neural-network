interface BlurProps {
  blur?: number;
  zIndex?: number;
  opacity?: number;
  top?: number;
  style?: React.CSSProperties;
  className?: string;
}

const Blur = ({
  blur = 0,
  zIndex = 0,
  opacity = 1,
  top = 0,
  style,
  className,
}: BlurProps) => {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 animate-pulse transition-all duration-600 md:opacity-[1] ${className ?? ""}`}
      style={{
        top: `${top}px`,
        zIndex,
        opacity,
        animation: "scaleAnimation 3s ease-in-out infinite",
        ...style,
      }}
    >
      <img
        src="/images/color.webp"
        className="h-[280px] w-[280px]"
        style={{
          filter: `blur(${blur}px)`,
          animation: `scaleAnimation 5s ease-in-out infinite`,
        }}
      />
      <style jsx>{`
        @keyframes scaleAnimation {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default Blur;
