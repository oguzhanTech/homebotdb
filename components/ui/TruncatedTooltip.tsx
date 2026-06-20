"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PortalTooltip } from "@/components/ui/PortalTooltip";
import { cn } from "@/lib/utils";

export function TruncatedTooltip({
  label,
  className,
  containerClassName,
  tooltipClassName,
  sentenceCase = true,
}: {
  label: string;
  className?: string;
  containerClassName?: string;
  tooltipClassName?: string;
  /** When true, tooltip uses sentence case instead of uppercase styling. */
  sentenceCase?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setTruncated(el.scrollWidth > el.clientWidth + 1);
  }, []);

  useEffect(() => {
    checkTruncation();
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(el);
    return () => observer.disconnect();
  }, [checkTruncation, label]);

  const text = (
    <span ref={ref} className={cn("block w-full min-w-0 truncate", className)}>
      {label}
    </span>
  );

  const content = truncated ? (
    <PortalTooltip
      label={label}
      sentenceCase={sentenceCase}
      className={tooltipClassName}
      triggerClassName="flex min-w-0 w-full"
    >
      {text}
    </PortalTooltip>
  ) : (
    text
  );

  if (!containerClassName) {
    return content;
  }

  return <span className={containerClassName}>{content}</span>;
}
