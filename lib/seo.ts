import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { getEditorById } from "@/lib/editors";
import { getAbsoluteUpdateCoverImage, getUpdateCoverImage } from "@/lib/update-images";
import { getUpdatePublicPath } from "@/lib/update-paths";
import type { Robot } from "@/types/robot";
import type { Update } from "@/types/update";
import { isNewsUpdate } from "@/types/update";
import type { Comment, CommentTarget } from "@/types/comment";
import { commentPermalink } from "@/lib/comment-permalink";
import { groupCommentsByThread } from "@/lib/data/comments";

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function canonicalPath(path: string = ""): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "",
  image,
  authors,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  authors?: { name: string }[];
}): Metadata {
  const pagePath = canonicalPath(path);
  const ogImage = image ?? siteConfig.defaultOgImage;

  return {
    title,
    description,
    ...(authors ? { authors } : {}),
    alternates: { canonical: pagePath },
    openGraph: {
      title,
      description,
      url: pagePath,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function buildRobotMetadata(robot: Robot): Metadata {
  return buildPageMetadata({
    title: `${robot.name} — ${robot.brand}`,
    description: robot.shortDescription,
    path: `/robots/${robot.slug}`,
    image: getPrimaryRobotImage(robot) || siteConfig.defaultOgImage,
  });
}

export function buildCompareMetadata(
  robots: Robot[],
  descriptionOverride?: string,
  options?: { indexable?: boolean },
): Metadata {
  const names = robots.map((robot) => robot.name).join(" vs ");
  const description =
    descriptionOverride ??
    `Compare ${names} side by side. Specs, scores, availability, and home capabilities on ${siteConfig.name}.`;
  const metadata = buildPageMetadata({
    title: `${names} — Home Robot Comparison`,
    description,
    path: `/compare/${robots.map((r) => r.slug).sort().join("-vs-")}`,
  });

  if (options?.indexable === false) {
    return {
      ...metadata,
      robots: { index: false, follow: true },
    };
  }

  return metadata;
}

export function buildCompareFaqJsonLd(robots: Robot[], answer: string) {
  const names = robots.map((r) => r.name).join(" or ");
  const pagePath = `/compare/${robots.map((r) => r.slug).sort().join("-vs-")}`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Should I buy ${names}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      },
    ],
    url: absoluteUrl(pagePath),
  };
}

export function buildUpdateMetadata(update: Update): Metadata {
  const author = getEditorById(update.authorId);
  const image = getUpdateCoverImage(update)
    ? getAbsoluteUpdateCoverImage(update)
    : undefined;

  return buildPageMetadata({
    title: update.title,
    description: update.summary,
    path: getUpdatePublicPath(update),
    authors: [{ name: author.name }],
    image,
  });
}

export function buildRobotJsonLd(robot: Robot) {
  const pageUrl = `${siteConfig.url}/robots/${robot.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: robot.name,
    description: robot.shortDescription,
    brand: { "@type": "Brand", name: robot.brand },
    image: getPrimaryRobotImage(robot)
      ? absoluteUrl(getPrimaryRobotImage(robot)!)
      : undefined,
    url: pageUrl,
    offers: robot.price
      ? {
          "@type": "Offer",
          price: robot.price.replace(/[^0-9.]/g, "") || undefined,
          priceCurrency: "USD",
          availability:
            robot.commercialStatus === "buy_now"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
        }
      : undefined,
  };
}

export function buildNewsArticleJsonLd(update: Update) {
  const author = getEditorById(update.authorId);
  const pagePath = getUpdatePublicPath(update);
  const pageUrl = absoluteUrl(pagePath);
  const imageUrl = getAbsoluteUpdateCoverImage(update);
  const articleBody = markdownToPlainText(
    `${update.summary}\n\n${update.content}`,
  );

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${pageUrl}#article`,
    headline: update.title,
    description: update.summary,
    articleBody,
    datePublished: update.createdAt,
    dateModified: update.updatedAt,
    author: {
      "@type": "Person",
      name: author.name,
    },
    image: [imageUrl],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.defaultOgImage),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
    isAccessibleForFree: true,
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function buildCommentJsonLdNode(comment: Comment, pagePath: string) {
  const url = commentPermalink(pagePath, comment.id);
  return {
    "@type": "Comment",
    "@id": url,
    url,
    text: comment.body,
    datePublished: comment.createdAt,
    author: {
      "@type": "Person",
      name: comment.authorName,
      ...(comment.isAdmin
        ? { affiliation: { "@type": "Organization", name: siteConfig.name } }
        : {}),
    },
  };
}

export function buildDiscussionJsonLd({
  target,
  pagePath,
  pageTitle,
  pageDescription,
  comments,
}: {
  target: CommentTarget;
  pagePath: string;
  pageTitle: string;
  pageDescription: string;
  comments: Comment[];
}) {
  const pageUrl = `${siteConfig.url}${pagePath}`;
  const { topLevel, repliesByParent } = groupCommentsByThread(comments);

  const discussionComments = topLevel.flatMap((comment) => {
    const replies = repliesByParent.get(comment.id) ?? [];
    return [comment, ...replies].map((entry) =>
      buildCommentJsonLdNode(entry, pagePath),
    );
  });

  const aboutId =
    target.type === "robot"
      ? `${pageUrl}#product`
      : `${pageUrl}#article`;

  return {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: `Comments on ${pageTitle}`,
    description: pageDescription,
    url: `${pageUrl}#comments`,
    about: {
      "@id": aboutId,
    },
    comment: discussionComments,
  };
}
