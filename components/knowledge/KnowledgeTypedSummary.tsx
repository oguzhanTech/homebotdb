"use client";

import { useEffect, useRef, useState } from "react";
import { uiCopy } from "@/config/ui-copy";

function BotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

export function KnowledgeTypedSummary({ text }: { text: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setStarted(false);
    setCount(0);
    if (reduceMotion) return;
    const node = rootRef.current;
    if (!node) return;

    let wait = 0;
    let begun = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (begun || !entries.some((entry) => entry.isIntersecting)) return;
        begun = true;
        wait = window.setTimeout(() => setStarted(true), 650);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(wait);
    };
  }, [reduceMotion, text]);

  useEffect(() => {
    if (reduceMotion || !started || count >= text.length) return;
    const step = Math.max(12, Math.min(22, Math.round(1800 / text.length)));
    const tick = window.setTimeout(() => setCount((value) => value + 1), step);
    return () => window.clearTimeout(tick);
  }, [count, reduceMotion, started, text]);

  const typed = reduceMotion || count >= text.length;
  const visible = reduceMotion
    ? text
    : started && count > 0
      ? text.slice(0, count)
      : uiCopy.knowledge.generatingAnswer;

  return (
    <div
      ref={rootRef}
      className="mt-5 rounded-[18px] border border-line bg-blue-soft px-4 py-4 shadow-card sm:px-5"
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue">
        <BotIcon />
        <span>{uiCopy.knowledge.summary}</span>
      </div>
      <p className="sr-only">{text}</p>
      <div className="relative mt-2" aria-hidden="true">
        <p className="invisible text-base font-medium leading-[1.65]">{text}</p>
        <p className="absolute left-0 top-0 w-full text-base font-medium leading-[1.65] text-ink">
          {visible}
          {typed ? null : <span className="knowledge-caret ml-0.5 inline-block">|</span>}
        </p>
      </div>
    </div>
  );
}
