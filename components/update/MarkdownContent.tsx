import Link from "next/link";
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import {
  EXTERNAL_PROSE_LINK_CLASS,
  INTERNAL_LINK_CLASS,
  linkifyPlainText,
} from "@/lib/content-internal-links";
import { isEmbeddableVideo } from "@/lib/video";
import { NewsYouTubeEmbed } from "@/components/update/NewsYouTubeEmbed";

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

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function getYouTubeEmbedFromParagraph(
  children: ReactNode,
): { url: string; caption?: string } | null {
  const items = Children.toArray(children);
  if (items.length !== 1) return null;

  const child = items[0];
  if (typeof child === "string") {
    const url = child.trim();
    return isEmbeddableVideo(url) ? { url } : null;
  }

  if (!isValidElement<{ href?: string; children?: ReactNode }>(child)) {
    return null;
  }

  const href = child.props.href;
  if (typeof href !== "string" || !isEmbeddableVideo(href)) {
    return null;
  }

  const caption = extractText(child.props.children).trim();
  return { url: href, caption: caption || undefined };
}

function shouldLinkifyInside(child: ReactElement): boolean {
  if (child.type === "a" || child.type === Link) return false;
  if (child.type === MarkdownImage || child.type === "img") return false;
  return true;
}

function LinkifyChildren({
  children,
  keyPrefix,
  usedHrefs,
}: {
  children: ReactNode;
  keyPrefix: string;
  usedHrefs: Set<string>;
}) {
  return Children.map(children, (child, index) => {
    if (typeof child === "string") {
      return (
        <Fragment key={`${keyPrefix}-${index}`}>
          {linkifyPlainText(child, `${keyPrefix}-${index}`, usedHrefs)}
        </Fragment>
      );
    }

    if (isValidElement(child) && shouldLinkifyInside(child)) {
      const element = child as ReactElement<{ children?: ReactNode }>;
      return cloneElement(element, {
        key: `${keyPrefix}-${index}`,
        children: (
          <LinkifyChildren
            keyPrefix={`${keyPrefix}-${index}`}
            usedHrefs={usedHrefs}
          >
            {element.props.children}
          </LinkifyChildren>
        ),
      });
    }

    return child;
  });
}

export function MarkdownContent({ content }: { content: string }) {
  const usedHrefs = new Set<string>();

  return (
    <div className="news-prose mt-8 max-w-none">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="mt-8 text-xl font-semibold tracking-tight text-[#2a3038] first:mt-0">
              <LinkifyChildren keyPrefix="news-h2" usedHrefs={usedHrefs}>
                {children}
              </LinkifyChildren>
            </h2>
          ),
          p: ({ children }) => {
            if (isImageParagraph(children)) {
              return <>{children}</>;
            }

            const youtube = getYouTubeEmbedFromParagraph(children);
            if (youtube) {
              return (
                <NewsYouTubeEmbed
                  url={youtube.url}
                  caption={youtube.caption}
                />
              );
            }

            return (
              <p className="mt-4 text-[15px] leading-[1.7] text-[#4d5662] first:mt-0">
                <LinkifyChildren keyPrefix="news-p" usedHrefs={usedHrefs}>
                  {children}
                </LinkifyChildren>
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-[#4d5662]">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li>
              <LinkifyChildren keyPrefix="news-li" usedHrefs={usedHrefs}>
                {children}
              </LinkifyChildren>
            </li>
          ),
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              if (usedHrefs.has(href)) {
                return (
                  <span className="font-semibold text-[#2a3038]">{children}</span>
                );
              }

              usedHrefs.add(href);
              return (
                <Link href={href} className={INTERNAL_LINK_CLASS}>
                  {children}
                </Link>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={EXTERNAL_PROSE_LINK_CLASS}
              >
                {children}
              </a>
            );
          },
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
