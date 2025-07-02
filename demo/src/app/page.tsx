import Image from "next/image";
import MathPreview from "~/components/MathPreview";

export default function HomePage() {
  return (
    <main className="bg-black">
      <div className="flex w-full flex-col">
        <div className="h-[85vh]"></div>
        <MathPreview />
      </div>
    </main>
  );
}
