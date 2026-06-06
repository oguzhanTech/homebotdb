import Link from "next/link";
import { legalConfig, legalLinks } from "@/config/legal";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line/80 px-3.5 py-4 sm:px-7">
      <div className="flex flex-col gap-2 text-[11px] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-1">
        <p>
          © {year} {legalConfig.operatorName}
          <span className="hidden sm:inline"> · </span>
          <span className="mt-0.5 block sm:mt-0 sm:inline">{siteConfig.tagline}</span>
        </p>
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center gap-x-3 gap-y-1"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer font-medium uppercase tracking-wider text-[#5d6570] transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${legalConfig.contactEmail}`}
            className="cursor-pointer font-medium uppercase tracking-wider text-[#5d6570] transition-colors hover:text-ink"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
