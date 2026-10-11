"use client";

import AnimatedLogo, {
  StaticLogo,
} from "../components/AnimatedLogo";
import { useState } from "react";

export default function LogoDemoPage() {
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleReplay = () => {
    setKey((k) => k + 1);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          iNZight Analytics Logo Animation Demo
        </h1>

        <div className="space-y-12">
          {/* Animated Logo */}
          <section className="border rounded-lg p-8 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Animated Logo
            </h2>
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <AnimatedLogo
                  key={key}
                  width={500}
                  autoplay={isPlaying}
                  onComplete={() => console.log("Animation complete!")}
                  loop={false}
                  startDelay={500}
                />
              </div>
              <button
                onClick={handleReplay}
                className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                Replay Animation
              </button>
            </div>
          </section>

          {/* Static Logo */}
          <section className="border rounded-lg p-8 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Static Logo (Final State)
            </h2>
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <StaticLogo width={400} />
              </div>
            </div>
          </section>

          {/* Dark Background Demo */}
          <section className="border rounded-lg p-8 bg-black">
            <h2 className="text-xl font-semibold mb-4 text-white">
              On Dark Background
            </h2>
            <div className="flex justify-center">
              <AnimatedLogo
                key={`dark-${key}`}
                width={400}
                autoplay={isPlaying}
                startDelay={1000}
                darkBackground
              />
            </div>
          </section>

          {/* Size Variants */}
          <section className="border rounded-lg p-8 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Size Variants
            </h2>
            <div className="flex flex-wrap items-end gap-8 justify-center">
              <div className="text-center">
                <StaticLogo width={150} />
                <p className="text-sm text-gray-500 mt-2">150px</p>
              </div>
              <div className="text-center">
                <StaticLogo width={250} />
                <p className="text-sm text-gray-500 mt-2">250px</p>
              </div>
              <div className="text-center">
                <StaticLogo width={350} />
                <p className="text-sm text-gray-500 mt-2">350px</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
