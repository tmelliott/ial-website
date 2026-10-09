import { useEffect, useRef, useState } from "react";
import CardClient from "./CardClient";
import { cn } from "./cn";
import type { CarouselApp } from "./types";

const AUTO_PROGRESS_INTERVAL = 5000;

export default function AppCarousel({ apps }: { apps: CarouselApp[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!apps || apps.length <= 1) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= apps.length - 1 ? 0 : prev + 1));
      }, AUTO_PROGRESS_INTERVAL);
    };

    if (!isPaused) {
      startInterval();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, apps]);

  if (!apps || apps.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= apps.length - 1 ? 0 : prev + 1));
  };

  const showArrows = apps.length > 1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < apps.length - 1;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={() => setIsPaused(true)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {apps.map((app) => (
          <div
            key={app.id}
            id={app.slug}
            className="w-full flex-shrink-0"
            style={{ minWidth: "100%" }}
          >
            <CardClient
              title={app.title}
              banner={app.banner}
              image={app.logo}
              keywords={app.keywords}
              url={app.link}
              type="app"
              linkType="button"
              variant="right"
              contentHtml={app.contentHtml}
              bannerBlur={app.bannerBlur}
            />
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          {canGoPrevious && (
            <button
              onClick={goToPrevious}
              className={cn(
                "absolute left-2 top-16 z-30 md:top-1/2 md:-translate-y-1/2",
                "min-h-11 min-w-11 flex items-center justify-center",
                "text-gray-400/70 hover:text-gray-600",
                "transition-all hover:scale-110",
                "pointer-events-auto cursor-pointer",
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

          {canGoNext && (
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-2 top-16 z-30 md:top-1/2 md:-translate-y-1/2",
                "min-h-11 min-w-11 flex items-center justify-center",
                "text-gray-400/70 hover:text-gray-600",
                "transition-all hover:scale-110",
                "pointer-events-auto cursor-pointer",
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

      {showArrows && apps.length > 1 && (
        <div className="flex justify-center items-center mt-1">
          {apps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center cursor-pointer"
              aria-label={`Go to app ${index + 1}`}
            >
              <span
                className={cn(
                  "rounded-full",
                  index === currentIndex
                    ? "w-2 h-2 bg-gray-400/80"
                    : "w-1.5 h-1.5 bg-gray-400/40",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
