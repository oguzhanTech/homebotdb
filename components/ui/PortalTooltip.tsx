"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const TOOLTIP_Z_INDEX = 200;
const VIEWPORT_PAD = 10;
const GAP = 6;

type TooltipCoords = {
  top: number;
  left: number;
};

export function PortalTooltip({
  label,
  children,
  className,
  sentenceCase = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  sentenceCase?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords>({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const positionTooltip = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const rect = trigger.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;

    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(
      VIEWPORT_PAD,
      Math.min(left, window.innerWidth - VIEWPORT_PAD - width),
    );

    let top = rect.top - GAP - height;
    if (top < VIEWPORT_PAD) {
      top = rect.bottom + GAP;
    }

    setCoords({ top, left });
    setVisible(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    positionTooltip();
  }, [open, label, positionTooltip]);

  useEffect(() => {
    if (!open) return;

    const onReposition = () => positionTooltip();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open, positionTooltip]);

  const tooltip =
    open && typeof document !== "undefined"
      ? createPortal(
          <span
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: TOOLTIP_Z_INDEX,
              visibility: visible ? "visible" : "hidden",
            }}
            className={cn(
              "pointer-events-none max-w-[min(320px,calc(100vw-20px))] rounded-lg border border-line bg-ink px-2.5 py-1.5 text-center text-[10px] leading-snug text-white shadow-[0_12px_40px_rgba(8,11,18,0.24)]",
              sentenceCase
                ? "font-normal normal-case tracking-normal"
                : "font-bold uppercase tracking-[0.08em]",
              className,
            )}
          >
            {label}
          </span>,
          document.body,
        )
      : null;

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={0}
        className="inline-flex"
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
      {tooltip}
    </>
  );
}
