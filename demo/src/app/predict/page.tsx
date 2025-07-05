"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Network from "~/components/Network";
import { useActivationsStore } from "~/store/activations";
import type { PredictionData } from "~/types/prediction";
import { env } from "~/env";
import Weight, { type WeightConnection } from "~/components/Weight";

const LAYERS = [16, 16, 16, 10];

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

  // Used to animate weights
  const [weights, setWeights] = useState<number[]>([1, 1, 1]);

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
      <div className="relative h-screen w-screen">
        {/* Network */}
        <div className="absolute top-1/2 left-1/2 z-[200] -translate-x-1/2 -translate-y-1/2">
          <Network width={300} />
        </div>

        {/* Weights */}
        {neuronPositions === undefined
          ? null
          : Object.values(neuronPositions).map((neuron, ind) => {
              if (neuron.layer === 3) {
                // Output layer so no weight
                return null;
              }

              let nA = neuron;
              let proceedingLayer = neuron.layer + 1;

              let connections: WeightConnection[] = [];

              for (let i = 0; i < LAYERS[proceedingLayer]!; i++) {
                let nB = neuronPositions[`${proceedingLayer}-${i}`];

                let w: number =
                  weights[neuron.layer] === undefined
                    ? 1
                    : weights[neuron.layer]!;

                if (nB !== undefined) {
                  connections.push({
                    x: nB.x,
                    y: nB.y,
                    activation: nA.activation * nB.activation * w,
                  });
                }
              }

              return (
                <Weight
                  key={ind}
                  x1={nA.x}
                  y1={nA.y}
                  connections={connections}
                />
              );
            })}
      </div>
    </div>
  );
}
