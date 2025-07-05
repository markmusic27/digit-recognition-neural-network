"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Network from "~/components/Network";
import { useActivationsStore } from "~/store/activations";
import type { PredictionData } from "~/types/prediction";
import { env } from "~/env";
import Weight, { type WeightConnection } from "~/components/Weight";
import CustomButton from "~/components/CustomButton";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import type { NeuronDisplay } from "~/components/Layer";

const LAYERS = [16, 16, 16, 10];
const ANIMATION_DURATION = 800;

export default function PredictPage() {
  const {
    activations,
    setHidden1,
    setHidden2,
    setOutput,
    output,
    hoveredActivation,
    neuronPositions,
    isHovering,
    weights,
    setWeights,
    setNeuronWeights,
  } = useActivationsStore();
  const [loaded, setLoaded] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [showHUD, setShowHud] = useState(false);
  const router = useRouter();

  // Disable scrolling
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Screen width state
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    setWeights([0, 0, 0]);
    setNeuronWeights([1, 0, 0, 0]);

    // Set initial width
    updateScreenWidth();

    // Add event listener
    window.addEventListener("resize", updateScreenWidth);

    // Cleanup
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  function animateIn() {
    setTimeout(() => {
      // STEP 1
      setWeights([0.5, 0, 0]);
      setNeuronWeights([1, 1, 0, 0]);
    }, 500);
    setTimeout(() => {
      // STEP 2
      setWeights([0, 1, 0]);
      setNeuronWeights([1, 1, 1, 0]);
    }, 500 + ANIMATION_DURATION);
    setTimeout(
      () => {
        // STEP 3
        setWeights([0, 0, 1]);
        setNeuronWeights([1, 1, 1, 1]);
      },
      500 + ANIMATION_DURATION * 2,
    );
    setTimeout(
      () => {
        // STEP 4
        setWeights([0, 0, 0]);
      },
      500 + ANIMATION_DURATION * 3,
    );
    setTimeout(
      () => {
        // STEP 5
        setWeights([0, 1, 1]);
        setShowHud(true);
      },
      500 + ANIMATION_DURATION * 4 + 200,
    );
    setTimeout(
      () => {
        // STEP 5
        setWeights([0, 1, 1]);
        if (screenWidth > 640) {
          setShowHud(false);
        }
      },
      500 + ANIMATION_DURATION * 10 + 200,
    );
  }

  const getMath = (hA: [number, number], nP: Record<string, NeuronDisplay>) => {
    let digit = `a_{${hA[0]}}^{(${hA[1]})}`;
    let n = nP[`${hA[0]}-${hA[1]}`];
    return `${digit} = ${n === undefined ? 0 : n.activation}`;
  };

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

        animateIn();
      })
      .catch(() => {
        setLoaded(true);

        animateIn();
      });
  }, [activations, router]);

  return (
    <div
      className={`flex h-[100dvh] flex-col justify-center transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-[100dvh] w-[100dvw]">
        {/* Other Inidcators */}
        <div className="absolute bottom-[4%] left-1/2 z-[201] -translate-x-1/2">
          <CustomButton
            text="Predict Another"
            icon="􀆉"
            iconSize={14}
            onClick={router.back}
          />
        </div>

        <div
          className={`absolute top-[3%] left-1/2 z-[201] block -translate-x-1/2 transition-opacity duration-400 md:hidden ${
            showHUD ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-[17px] border-[1px] border-[#2A2A2A] bg-[#0A0A0A] px-[26px] py-[14px] text-center text-[#939393]">
            <p className="font-sf cursor-default text-[16px] font-[400px] tracking-wide whitespace-nowrap">
              {`Predicted ${output.indexOf(Math.max(...output))} with ${(Math.max(...output) * 100).toFixed(1)}% confidence`}
            </p>
          </div>
        </div>

        <div
          className={`absolute top-[3%] left-1/2 z-[201] hidden -translate-x-1/2 transition-opacity duration-400 md:block ${
            showHUD || isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-[17px] border-[1px] border-[#2A2A2A] bg-[#0A0A0A] px-[26px] py-[14px] text-[#939393]">
            {showHUD ? (
              <p className="font-sf cursor-default text-[16px] font-[400px] tracking-wide">
                {`Predicted ${output.indexOf(Math.max(...output))} with ${(Math.max(...output) * 100).toFixed(1)}% confidence`}
              </p>
            ) : (
              <InlineMath math={getMath(hoveredActivation, neuronPositions)} />
            )}
          </div>
        </div>

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
                    z: nA.activation * nB.activation * 100,
                    activation:
                      nA.layer === 0 ? w : nA.activation * nB.activation * w,
                  });
                }
              }

              return (
                <Weight
                  key={ind}
                  x1={nA.x}
                  y1={nA.y}
                  thickness={screenWidth < 820 ? 0.5 : 1}
                  connections={connections}
                />
              );
            })}
      </div>
    </div>
  );
}
