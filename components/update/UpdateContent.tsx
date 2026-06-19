import Link from "next/link";
import { Fragment } from "react";
import { getRobotBySlug } from "@/lib/data/repository";

const INTERNAL_PATH_PATTERN =
  /(\/(?:robots|compare|updates|news|wizard)(?:\/[a-z0-9-]+(?:-vs-[a-z0-9-]+)?)?)/gi;

function labelForPath(href: string): string {
  if (href === "/robots") return "robot catalog";
  if (href === "/compare") return "Compare robots";
  if (href === "/updates") return "Radar Feed";
  if (href === "/news") return "News";
  if (href === "/wizard") return "Robot Matchmaker";

  if (href.startsWith("/robots/")) {
    const slug = href.replace("/robots/", "");
    return getRobotBySlug(slug)?.name ?? slug.replace(/-/g, " ");
  }

  if (href.startsWith("/compare/")) {
    const slug = href.replace("/compare/", "");
    const parts = slug.split("-vs-");
    if (parts.length === 2) {
      const left = getRobotBySlug(parts[0])?.name ?? parts[0];
      const right = getRobotBySlug(parts[1])?.name ?? parts[1];
      return `${left} vs ${right}`;
    }
    return slug.replace(/-vs-/g, " vs ");
  }

  return href.replace(/^\//, "");
}

function linkifyParagraph(text: string, key: string) {
  const parts = text.split(INTERNAL_PATH_PATTERN);

  return (
    <p key={key} className="text-[15px] leading-[1.7] text-[#4d5662]">
      {parts.map((part, index) => {
        if (!part || !part.startsWith("/")) {
          return <Fragment key={`${key}-${index}`}>{part}</Fragment>;
        }

        return (
          <Link
            key={`${key}-${index}`}
            href={part}
            className="font-semibold text-blue hover:underline"
          >
            {labelForPath(part)}
          </Link>
        );
      })}
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
