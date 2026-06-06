function getSourceHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

export function SourceLink({ url }: { url: string }) {
  const hostname = getSourceHostname(url);

  return (
    <div className="mt-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
        Referenced
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4d5662] shadow-card transition-colors hover:border-blue/30 hover:text-blue"
      >
        {hostname}
        <span aria-hidden className="text-muted">
          ↗
        </span>
      </a>
    </div>
  );
}
