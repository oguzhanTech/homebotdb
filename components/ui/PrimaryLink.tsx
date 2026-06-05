import Link from "next/link";
import { cn } from "@/lib/utils";

const primaryLinkClass =
  "inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-ink px-5 text-xs font-bold uppercase tracking-widest !text-white shadow-card transition-colors hover:bg-ink/90";

export function PrimaryLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(primaryLinkClass, className)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(primaryLinkClass, className)}>
      {children}
    </Link>
  );
}

export function BuyNowLink({
  href,
  className,
  label = "Buy now",
}: {
  href: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(primaryLinkClass, className)}
    >
      {label}
    </a>
  );
}
