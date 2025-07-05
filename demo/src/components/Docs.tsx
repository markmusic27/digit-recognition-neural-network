import React, { useEffect, useState } from "react";

const Docs = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      className="mb-[20px] rounded-[12px] border-[1px] border-[#272727] bg-black"
      style={{ height: `${height - 40}px` }}
    >
      {/* Your content */}
    </div>
  );
};

export default Docs;
