"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Network from "~/components/Network";
import { useActivationsStore } from "~/store/activations";
import type { PredictionData } from "~/types/prediction";
import { env } from "~/env";

export default function PredictPage() {
  const {
    activations,
    setHidden1,
    setHidden2,
    setOutput,
    hoveredActivation,
    neuronPositions,
  } = useActivationsStore();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(false);

    // Send pixel data to /api/predict
    const pixels = activations;

    fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pixels }),
    })
      .then((res) => res.json())
      .then((data: PredictionData) => {
        setHidden1(data.h1);
        setHidden2(data.h2);
        setOutput(data.o);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [activations, router]);

  return (
    <div
      className={`flex h-screen flex-col justify-center transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <p>{`Layer ${hoveredActivation?.[0]}, Neuron ${hoveredActivation?.[1]}, Position: ${neuronPositions[`0-0`]?.x}, ${neuronPositions[`0-0`]?.y}`}</p>
      <div className="flex flex-row justify-center">
        <Network width={300} />
      </div>
    </div>
  );
}
