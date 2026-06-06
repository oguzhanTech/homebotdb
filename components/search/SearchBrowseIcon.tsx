import type { PrimaryTask } from "@/types/robot";
import type { SiteSearchKind } from "@/lib/site-search";
import { cn } from "@/lib/utils";

function SvgGlyph({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn("h-3.5 w-3.5", className)}
    >
      {children}
    </svg>
  );
}

function IconShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
        className,
      )}
    >
      {children}
    </span>
  );
}

const taskIconConfig: Record<
  PrimaryTask,
  { shell: string; glyph: React.ReactNode }
> = {
  home_assistant: {
    shell: "border-indigo-300/80 bg-indigo-50 text-indigo-700",
    glyph: (
      <SvgGlyph>
        <path
          d="M3 7.5 8 3.5l5 4V13a1 1 0 0 1-1 1h-3v-3.5H7V14H4a1 1 0 0 1-1-1V7.5Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </SvgGlyph>
    ),
  },
  cleaning: {
    shell: "border-emerald-300/80 bg-emerald-50 text-emerald-700",
    glyph: (
      <SvgGlyph>
        <path
          d="M4.5 11.5c1.2-2.4 2.8-4 4.5-5.5M9 4l3 3"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M3.5 12.5 2 14M6 10l1.5 1.5M11.5 6.5 13 5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M5.5 3.5c.8.8.8 2.2 0 3"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
  conversation: {
    shell: "border-violet-300/80 bg-violet-50 text-violet-700",
    glyph: (
      <SvgGlyph>
        <path
          d="M3.5 4.5h9a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1H7l-2.5 2v-2H3.5a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M6 7.5h4M6 9.5h2.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
  education: {
    shell: "border-sky-300/80 bg-sky-50 text-sky-700",
    glyph: (
      <SvgGlyph>
        <path
          d="M8 3.5 3 6v4.5L8 13l5-2.5V6L8 3.5Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M8 8.5V13"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
  elder_care: {
    shell: "border-rose-300/80 bg-rose-50 text-rose-700",
    glyph: (
      <SvgGlyph>
        <path
          d="M8 13.5s-4.5-2.8-4.5-5.4a2.7 2.7 0 0 1 4.5-2.1 2.7 2.7 0 0 1 4.5 2.1c0 2.6-4.5 5.4-4.5 5.4Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </SvgGlyph>
    ),
  },
  entertainment: {
    shell: "border-fuchsia-300/80 bg-fuchsia-50 text-fuchsia-700",
    glyph: (
      <SvgGlyph>
        <rect
          x="3.5"
          y="5"
          width="9"
          height="6"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path d="M7 7.5v3l2.5-1.5L7 7.5Z" fill="currentColor" />
      </SvgGlyph>
    ),
  },
};

const capabilityIconConfig: Record<
  string,
  { shell: string; glyph: React.ReactNode }
> = {
  Mobility: {
    shell: "border-blue/30 bg-blue-soft text-blue",
    glyph: (
      <SvgGlyph>
        <path
          d="M5.5 11.5V8.5l1.2-2.4a1 1 0 0 1 .9-.6h.8a1 1 0 0 1 .9.6L10.5 8.5v3"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 11.5h7"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
  Manipulation: {
    shell: "border-amber-400/45 bg-amber-50 text-amber-800",
    glyph: (
      <SvgGlyph>
        <path
          d="M8 4v5.5M6 6.5V9a2 2 0 0 0 4 0V6.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M5.5 9.5 4 11M10.5 9.5 12 11"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
  Perception: {
    shell: "border-violet-300/80 bg-violet-50 text-violet-700",
    glyph: (
      <SvgGlyph>
        <path
          d="M8 5.5a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle cx="8" cy="8.3" r="0.9" fill="currentColor" />
      </SvgGlyph>
    ),
  },
  Autonomy: {
    shell: "border-slate-300/80 bg-slate-50 text-slate-600",
    glyph: (
      <SvgGlyph>
        <rect
          x="4"
          y="4"
          width="8"
          height="8"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M6 6.5h1.2M8.8 6.5H10M6 9.5h4"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
  "Social Interaction": {
    shell: "border-fuchsia-300/80 bg-fuchsia-50 text-fuchsia-700",
    glyph: (
      <SvgGlyph>
        <circle cx="5.8" cy="6.2" r="1.4" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="10.2" cy="6.2" r="1.4" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M3.8 11.5c.8-1.4 2-2.1 3.5-2.1h1.4c1.5 0 2.7.7 3.5 2.1"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
  "Home Navigation": {
    shell: "border-emerald-300/80 bg-emerald-50 text-emerald-700",
    glyph: (
      <SvgGlyph>
        <path
          d="M8 3.5v9M8 3.5 5.5 6M8 3.5 10.5 6"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 12.5h7"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </SvgGlyph>
    ),
  },
};

const fallbackBrowseIcon = {
  shell: "border-line bg-soft text-muted",
  glyph: (
    <SvgGlyph>
      <path
        d="M4 8h8M8 4v8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </SvgGlyph>
  ),
};

export function SearchBrowseIcon({
  kind,
  id,
  title,
}: {
  kind: SiteSearchKind;
  id: string;
  title: string;
}) {
  if (kind === "task") {
    const task = id.replace("task-", "") as PrimaryTask;
    const config = taskIconConfig[task] ?? fallbackBrowseIcon;
    return <IconShell className={config.shell}>{config.glyph}</IconShell>;
  }

  if (kind === "capability") {
    const config = capabilityIconConfig[title] ?? fallbackBrowseIcon;
    return <IconShell className={config.shell}>{config.glyph}</IconShell>;
  }

  return null;
}

export function SearchArticleIcon({ kind }: { kind: "news" | "update" }) {
  if (kind === "news") {
    return (
      <IconShell className="border-blue/30 bg-blue-soft text-blue">
        <SvgGlyph>
          <path
            d="M4.5 3.5h7a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.15"
          />
          <path
            d="M6 6.5h4M6 8.5h4M6 10.5h2.5"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        </SvgGlyph>
      </IconShell>
    );
  }

  return (
    <IconShell className="border-line bg-soft text-muted">
      <SvgGlyph>
        <path
          d="M11.5 3.5A4.5 4.5 0 0 0 5.8 9.2L4 12l2.8-1.8A4.5 4.5 0 1 0 11.5 3.5Z"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      </SvgGlyph>
    </IconShell>
  );
}
