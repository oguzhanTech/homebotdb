import Link from "next/link";
import { legalConfig, legalLinks } from "@/config/legal";
import { siteConfig } from "@/config/site";
import type { LegalSection } from "@/config/legal";
import { cn } from "@/lib/utils";

export function LegalDocument({
  title,
  intro,
  sections,
  className,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  className?: string;
}) {
  return (
    <article className={cn("mx-auto max-w-2xl", className)}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Legal
      </p>
      <h1 className="mt-1 text-3xl font-medium tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">
        Last updated: {legalConfig.lastUpdated}
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-[#565f6b]">{intro}</p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#4d5662]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul className="list-disc space-y-2 pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
        Related:{" "}
        {legalLinks.map((link, index) => (
          <span key={link.href}>
            {index > 0 ? " · " : null}
            <Link
              href={link.href}
              className="cursor-pointer text-blue hover:underline"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </p>
    </article>
  );
}

export function LegalPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      {children}
    </main>
  );
}

export function legalPageTitle(page: string) {
  return `${page} — ${siteConfig.name}`;
}
