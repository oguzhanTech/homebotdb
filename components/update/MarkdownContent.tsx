import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";

function MarkdownImage({ src, alt }: { src?: string | null; alt?: string | null }) {
  return (
    <figure className="mt-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        className="w-full rounded-[14px] border border-line bg-panel-strong shadow-card"
      />
      {alt ? (
        <figcaption className="news-image-caption">{alt}</figcaption>
      ) : null}
    </figure>
  );
}

function isImageParagraph(children: ReactNode) {
  const items = Children.toArray(children);
  return (
    items.length === 1 &&
    isValidElement(items[0]) &&
    items[0].type === MarkdownImage
  );
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="news-prose mt-8 max-w-none">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="mt-8 text-xl font-semibold tracking-tight text-[#2a3038] first:mt-0">
              {children}
            </h2>
          ),
          p: ({ children }) => {
            if (isImageParagraph(children)) {
              return <>{children}</>;
            }
            return (
              <p className="mt-4 text-[15px] leading-[1.7] text-[#4d5662] first:mt-0">
                {children}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-[#4d5662]">
              {children}
            </ul>
          ),
          li: ({ children }) => <li>{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue hover:underline"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[#2a3038]">{children}</strong>
          ),
          img: ({ src, alt }) => (
            <MarkdownImage
              src={typeof src === "string" ? src : undefined}
              alt={typeof alt === "string" ? alt : undefined}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
