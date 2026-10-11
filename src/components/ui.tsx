import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  dark = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`mt-3 font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl ${dark ? "text-brand-white" : ""}`}>
        {title}
      </h2>
      {text && <p className={`mt-4 max-w-2xl leading-relaxed ${dark ? "text-brand-white/60" : "text-brand-steel"}`}>{text}</p>}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "outline-dark";
}) {
  const styles = {
    primary: "bg-brand-red text-brand-white hover:bg-brand-red-dark",
    outline: "border border-brand-white/30 text-brand-white hover:border-brand-white",
    "outline-dark": "border border-brand-carbon text-brand-carbon hover:bg-brand-carbon hover:text-brand-white",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${styles[variant]}`}
    >
      {children}
      {variant === "primary" && <ArrowRight size={14} />}
    </Link>
  );
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="border-b border-brand-line bg-brand-mist">
      <Container className="py-14 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl leading-relaxed text-brand-steel">{text}</p>}
      </Container>
    </section>
  );
}
