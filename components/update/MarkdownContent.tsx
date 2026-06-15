import ReactMarkdown from "react-markdown";

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
          p: ({ children }) => (
            <p className="mt-4 text-[15px] leading-[1.7] text-[#4d5662] first:mt-0">
              {children}
            </p>
          ),
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
            <figure className="mt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src ?? ""}
                alt={alt ?? ""}
                className="w-full rounded-[14px] border border-line bg-panel-strong shadow-card"
              />
              {alt ? (
                <figcaption className="mt-2 text-center text-xs leading-relaxed text-muted">
                  {alt}
                </figcaption>
              ) : null}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
