"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMobileNav } from "@/contexts/MobileNavContext";
import { SidebarContent } from "./SidebarContent";
import { cn } from "@/lib/utils";

export function MobileSidebar({
  freshnessScore,
  lastUpdate,
}: {
  freshnessScore: number;
  lastUpdate: string | null;
}) {
  const pathname = usePathname();
  const { isOpen, close } = useMobileNav();

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) {
      const html = document.documentElement;
      const { body } = document;
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const html = document.documentElement;
    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.left = previous.bodyLeft;
      body.style.right = previous.bodyRight;
      body.style.width = previous.bodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <div
      className={cn(
        "z-50 xl:hidden",
        isOpen
          ? "fixed inset-0 w-full max-w-[100vw] overflow-x-hidden pointer-events-auto"
          : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={close}
        className={cn(
          "absolute inset-0 cursor-pointer bg-ink/20 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[min(288px,86vw)] flex-col border-l border-line bg-panel/95 px-5 py-7 shadow-[0_18px_50px_rgba(8,11,18,0.18)] backdrop-blur-[18px] transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{ paddingTop: "max(1.75rem, env(safe-area-inset-top))" }}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-panel-strong text-lg text-muted transition-colors hover:border-blue/30 hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto pb-2">
          <SidebarContent
            freshnessScore={freshnessScore}
            lastUpdate={lastUpdate}
            onNavigate={close}
            variant="mobile"
          />
        </div>
      </aside>
    </div>
  );
}
