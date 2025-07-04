"use client";

import Network from "~/components/Network";
import { useActivationsStore } from "~/store/activations";

export default function PredictPage() {
  const { activations } = useActivationsStore();

  return (
    <div className="">
      <Network width={300} />
    </div>
  );
}
