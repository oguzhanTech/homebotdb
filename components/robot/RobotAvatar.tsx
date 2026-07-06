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
    avatarSurface:
      "border border-line/60 bg-bg shadow-[0_18px_50px_rgba(8,11,18,0.08)]",
    imageClass: "object-[46%_100%]",
  },
  lg: {
    outer: "h-[160px] w-[160px]",
    avatar: "h-[140px] w-[140px]",
    ringMiddle: "inset-[16px]",
    ringInner: "inset-[40px]",
    avatarSurface:
      "border border-line/60 bg-bg shadow-[0_18px_50px_rgba(8,11,18,0.08)]",
  },
  spotlight: {
    outer: "h-[240px] w-[240px]",
    avatar: "h-[209px] w-[209px]",
    ringMiddle: "inset-[24px]",
    ringInner: "inset-[59px]",
    avatarSurface:
      "border border-line/60 bg-bg shadow-[0_18px_50px_rgba(8,11,18,0.08)]",
  },
  md: {
    outer: "h-[120px] w-[120px]",
    avatar: "h-[104px] w-[104px]",
    ringMiddle: "inset-[12px]",
    ringInner: "inset-[30px]",
    avatarSurface:
      "border border-line/60 bg-bg shadow-[0_18px_50px_rgba(8,11,18,0.08)]",
  },
  sm: {
    outer: "h-10 w-10",
    avatar: "h-9 w-9",
    ringMiddle: "",
    ringInner: "",
    avatarSurface: "border border-line/60 bg-bg",
  },
  card: {
    outer: "h-12 w-12",
    avatar: "h-11 w-11",
    ringMiddle: "",
    ringInner: "",
    avatarSurface: "border border-line/60 bg-bg",
  },
};

/** Fill the frame at full size; anchor bottom; clip top/sides inside the circle. */
function getImageClassName(config: (typeof sizes)[keyof typeof sizes]) {
  const imageClass =
    "imageClass" in config ? config.imageClass : undefined;
  return cn("h-full w-full object-cover", imageClass ?? "object-bottom");
}

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
  const imageClassName = getImageClassName(config);
  const ringsVisible = showRings && size !== "sm" && size !== "card";

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
          "relative z-[2] overflow-hidden rounded-full",
          config.avatar,
          config.avatarSurface,
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
                    imageClassName,
                    "absolute inset-0 transition-opacity ease-in-out",
                    index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0",
                  )}
                  style={{ transitionDuration: `${CAROUSEL_FADE_MS}ms` }}
                  aria-hidden={index !== activeIndex}
                />
              ))}
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={name} className={imageClassName} />
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
