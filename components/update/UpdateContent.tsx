import { linkifyPlainText } from "@/lib/content-internal-links";

function linkifyParagraph(text: string, key: string) {
  return (
    <p key={key} className="text-[15px] leading-[1.7] text-[#4d5662]">
      {linkifyPlainText(text, key)}
    </p>
  );
}

export function UpdateContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter((block) => block.trim().length > 0);

  return (
    <div className="prose prose-sm mt-8 max-w-none">
      {paragraphs.map((paragraph, index) =>
        linkifyParagraph(paragraph.trim(), `update-p-${index}`),
      )}
    </div>
  );
}
