const Dots = () => {
  return (
    <div className="my-[16px] flex flex-col items-center gap-[16px]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-[6px] w-[6px] rounded-full bg-white" />
      ))}
    </div>
  );
};

export default Dots;
