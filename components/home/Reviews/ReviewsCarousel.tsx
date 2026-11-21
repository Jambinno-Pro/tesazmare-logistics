"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface ReviewsCarouselProps {
  items: ReactNode[];
}

export default function ReviewsCarousel({ items }: ReviewsCarouselProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Responsive number of visible reviews
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 600) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 900) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }

      setCurrentIndex(0);
    };

    updateVisibleCount();

    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);

  // Automatically slide every 4 seconds
  useEffect(() => {
    if (items.length <= visibleCount || !animate || isPaused) return;

    const timer = window.setTimeout(() => {
      if (currentIndex >= maxIndex) {
        // Return to the beginning without sliding backwards
        setAnimate(false);
        setCurrentIndex(0);
      } else {
        setCurrentIndex((index) => index + 1);
      }
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [currentIndex, maxIndex, items.length, visibleCount, animate, isPaused]);

  // Re-enable animation after resetting
  useEffect(() => {
    if (!animate) {
      const frame = window.requestAnimationFrame(() => {
        setAnimate(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, [animate]);

  const trackStyle = {
    "--visible-count": visibleCount,
    "--slide-index": currentIndex,
    transform: `translateX(calc(-${(currentIndex * 100) / visibleCount}% - ${currentIndex * 20}px))`,
    transition: animate ? "transform 700ms ease-in-out" : "none",
  } as CSSProperties;

  return (
    <div
      className="reviews-carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="reviews-track" style={trackStyle}>
        {items.map((item, index) => (
          <div className="reviews-slide" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
