import { uiCopy } from "@/config/ui-copy";
import type { KnowledgeSource } from "@/lib/knowledge";

function sourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function KnowledgeSources({ sources }: { sources: KnowledgeSource[] }) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.knowledge.sources}
      </h2>
      <ol className="mt-3 grid gap-2">
        {sources.map((source, index) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-line bg-white px-3 py-2.5 shadow-card hover:border-blue/30"
            >
              <span className="w-6 shrink-0 font-mono text-[11px] font-bold text-blue">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{source.label}</span>
                <span className="block truncate text-[11px] text-muted">
                  {sourceHost(source.url)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
