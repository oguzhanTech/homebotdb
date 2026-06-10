"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RobotAvatar } from "@/components/robot/RobotAvatar";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "card";
type PreviewSize = "md" | "lg";

export function RobotAvatarHoverPreview({
  name,
  imageUrl,
  size = "sm",
  previewSize = "lg",
  className,
}: {
  name: string;
  imageUrl?: string;
  size?: AvatarSize;
  previewSize?: PreviewSize;
  className?: string;
}) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);

  const showPreview = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor || !imageUrl) return;

    const rect = anchor.getBoundingClientRect();
    setPreview({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, [imageUrl]);

  const hidePreview = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <>
      <div
        ref={anchorRef}
        className={cn("relative shrink-0 cursor-pointer", className)}
        onMouseEnter={showPreview}
        onMouseLeave={hidePreview}
      >
        <RobotAvatar
          name={name}
          imageUrl={imageUrl}
          size={size}
          showRings={false}
        />
      </div>

      {preview && imageUrl && typeof document !== "undefined"
        ? createPortal(
            <div
              role="presentation"
              aria-hidden
              className="pointer-events-none fixed z-[120] opacity-0 animate-[avatar-preview-in_140ms_ease-out_forwards]"
              style={{
                left: preview.x,
                top: preview.y,
              }}
            >
              <RobotAvatar
                name={name}
                imageUrl={imageUrl}
                size={previewSize}
                showRings={false}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
