import { linkifyPlainText } from "@/lib/content-internal-links";

function linkifyParagraph(
  text: string,
  key: string,
  usedHrefs: Set<string>,
) {
  return (
    <p key={key} className="text-[15px] leading-[1.7] text-[#4d5662]">
      {linkifyPlainText(text, key, usedHrefs)}
    </p>
  );
}

export function UpdateContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter((block) => block.trim().length > 0);
  const usedHrefs = new Set<string>();

  return (
    <div className="prose prose-sm mt-8 max-w-none">
      {paragraphs.map((paragraph, index) =>
        linkifyParagraph(paragraph.trim(), `update-p-${index}`, usedHrefs),
      )}
    </div>
  );
}
