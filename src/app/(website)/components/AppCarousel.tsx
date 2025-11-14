"use client";

import { useState } from "react";
import { App } from "@payload-types";
import CardClient from "./CardClient";
import { RichText } from "@payloadcms/richtext-lexical/react";
import cn from "../utils/cn";

type AppWithPlaceholder = App & { bannerPlaceholder?: string };

export default function AppCarousel({ apps }: { apps: AppWithPlaceholder[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!apps || apps.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(apps.length - 1, prev + 1));
  };

  // Only show arrows if there's more than one app
  const showArrows = apps.length > 1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < apps.length - 1;

  return (
    <div className="relative overflow-hidden">
      {/* Carousel container with all cards pre-loaded */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {apps.map((app, index) => (
          <div
            key={app.id}
            id={app.slug}
            className="w-full flex-shrink-0"
            style={{ minWidth: "100%" }}
          >
            <CardClient
              title={app.title}
              image={app.banner}
              keywords={app.keywords}
              url={app.link}
              type="app"
              linkType="button"
              variant="right"
              placeholder={app.bannerPlaceholder}
            >
              <RichText data={app.content} />
            </CardClient>
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          {/* Left Arrow - only show if not at first card */}
          {canGoPrevious && (
            <button
              onClick={goToPrevious}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-30",
                "px-2 py-8 flex items-center justify-center",
                "text-gray-400/70 hover:text-gray-600",
                "transition-all hover:scale-110",
                "pointer-events-auto cursor-pointer"
              )}
              aria-label="Previous app"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          {/* Right Arrow - only show if not at last card */}
          {canGoNext && (
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-30",
                "px-2 py-8 flex items-center justify-center",
                "text-gray-400/70 hover:text-gray-600",
                "transition-all hover:scale-110",
                "pointer-events-auto cursor-pointer"
              )}
              aria-label="Next app"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Progress dots - subtle indicators */}
      {showArrows && apps.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-4">
          {apps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "rounded-full transition-all cursor-pointer",
                index === currentIndex
                  ? "w-1.5 h-1.5 bg-gray-400/80"
                  : "w-1 h-1 bg-gray-400/40 hover:bg-gray-400/60"
              )}
              aria-label={`Go to app ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
