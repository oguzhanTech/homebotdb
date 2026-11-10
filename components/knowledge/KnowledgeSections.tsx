import { MarkdownContent } from "@/components/update/MarkdownContent";

function splitKnowledge(content: string) {
  const chunks = content.trim().split(/\n(?=## )/);
  let lead = "";
  const sections: { heading: string; body: string }[] = [];

  for (const chunk of chunks) {
    if (!chunk.startsWith("## ")) {
      lead = chunk.trim();
      continue;
    }
    const [first, ...rest] = chunk.split("\n");
    sections.push({
      heading: first.replace(/^##\s+/, "").trim(),
      body: rest.join("\n").trim(),
    });
  }

  return { lead, sections };
}

export function KnowledgeSections({ content }: { content: string }) {
  const { lead, sections } = splitKnowledge(content);

  return (
    <div className="mt-5 grid gap-3">
      {lead ? (
        <div className="rounded-[18px] border border-line bg-white px-4 py-4 shadow-card sm:px-5">
          <MarkdownContent content={lead} className="max-w-none" />
        </div>
      ) : null}
      {sections.map((section, index) => (
        <section
          key={section.heading}
          className="rounded-[18px] border border-line bg-panel/82 px-4 py-4 shadow-card sm:px-5"
        >
          <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight text-ink">
            <span className="font-mono text-[11px] font-bold text-blue">
              {String(index + 1).padStart(2, "0")}
            </span>
            {section.heading}
          </h2>
          {section.body ? (
            <MarkdownContent content={section.body} className="max-w-none" />
          ) : null}
        </section>
      ))}
    </div>
  );
}
