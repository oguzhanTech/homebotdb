"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { RobotImagePlaceholder } from "./RobotImagePlaceholder";

const sizes = {
  hero: {
    outer: "h-[350px] w-[350px]",
    avatar: "h-[300px] w-[300px]",
    ringMiddle: "inset-[34px]",
    ringInner: "inset-[83px]",
    image: "scale-[1.05] p-3",
  },
  lg: {
    outer: "h-[160px] w-[160px]",
    avatar: "h-[140px] w-[140px]",
    ringMiddle: "inset-[16px]",
    ringInner: "inset-[40px]",
    image: "scale-[1.04] p-2",
  },
  md: {
    outer: "h-[120px] w-[120px]",
    avatar: "h-[104px] w-[104px]",
    ringMiddle: "inset-[12px]",
    ringInner: "inset-[30px]",
    image: "scale-[1.02] p-1.5",
  },
  sm: {
    outer: "h-10 w-10",
    avatar: "h-9 w-9",
    ringMiddle: "",
    ringInner: "",
    image: "scale-[1.05] p-0.5",
  },
};

const CAROUSEL_INTERVAL_MS = 3400;
const CAROUSEL_FADE_MS = 900;

export function RobotAvatar({
  name,
  imageUrl,
  imageUrls,
  size = "hero",
  className,
  showRings = true,
  enableCarousel = false,
}: {
  name: string;
  imageUrl?: string;
  imageUrls?: string[];
  size?: keyof typeof sizes;
  className?: string;
  showRings?: boolean;
  enableCarousel?: boolean;
}) {
  const config = sizes[size];
  const ringsVisible = showRings && size !== "sm";

  const images = useMemo(() => {
    const fromList = imageUrls?.map((url) => url.trim()).filter(Boolean) ?? [];
    if (fromList.length > 0) return fromList;
    if (imageUrl?.trim()) return [imageUrl.trim()];
    return [];
  }, [imageUrl, imageUrls?.join("|")]);

  const imageKey = images.join("|");
  const carouselActive = enableCarousel && images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [imageKey]);

  useEffect(() => {
    if (!carouselActive) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [carouselActive, imageKey, images.length]);

  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col items-center justify-center",
        config.outer,
        className,
      )}
    >
      {ringsVisible && (
        <>
          <div className="absolute inset-0 rounded-full border border-line/80" />
          <div
            className={cn(
              "absolute rounded-full border border-dashed border-line/80",
              config.ringMiddle,
            )}
          />
          <div
            className={cn(
              "absolute rounded-full border border-dashed border-line/80",
              config.ringInner,
            )}
          />
        </>
      )}

      <div
        className={cn(
          "relative z-[2] overflow-hidden rounded-full border border-line/60 bg-gradient-to-b from-white via-[#f8f9fb] to-[#e8ebef] shadow-[inset_0_0_32px_rgba(8,11,18,0.05),0_18px_50px_rgba(8,11,18,0.08)]",
          config.avatar,
        )}
      >
        {images.length > 0 ? (
          carouselActive ? (
            <div className="relative h-full w-full">
              {images.map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={index === activeIndex ? name : `${name} view ${index + 1}`}
                  className={cn(
                    "absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_12px_24px_rgba(8,11,18,0.12)] transition-opacity ease-in-out",
                    config.image,
                    index === activeIndex
                      ? "z-10 opacity-100"
                      : "z-0 opacity-0",
                  )}
                  style={{ transitionDuration: `${CAROUSEL_FADE_MS}ms` }}
                  aria-hidden={index !== activeIndex}
                />
              ))}
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[0]}
              alt={name}
              className={cn(
                "h-full w-full object-contain object-bottom drop-shadow-[0_12px_24px_rgba(8,11,18,0.12)]",
                config.image,
              )}
            />
          )
        ) : (
          <RobotImagePlaceholder
            name={name}
            className="h-full w-full"
            compact
          />
        )}
      </div>

      {carouselActive && (
        <div className="absolute bottom-1 z-[3] flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === activeIndex
                  ? "w-4 bg-blue"
                  : "w-1.5 bg-line hover:bg-muted",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
