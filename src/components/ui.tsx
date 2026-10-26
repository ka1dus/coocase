import Image from "next/image";
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

export function PageHero({
  eyebrow,
  title,
  text,
  image = "/images/life/fuji-lake.webp",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  /** Background photo, shown darkened behind the title. */
  image?: string;
}) {
  return (
    <section className="relative -mt-16 overflow-hidden bg-brand-carbon pt-16 text-brand-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover opacity-25 blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-carbon via-brand-carbon/85 to-brand-carbon/30" />
      <div className="absolute inset-y-0 right-0 hidden w-1/4 bg-brand-red/90 clip-slant md:block" aria-hidden />
      <Container className="relative py-20 sm:py-28">
        <p className="eyebrow rule">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl animate-rise font-display text-5xl font-bold uppercase leading-[0.92] sm:text-7xl">{title}</h1>
        {text && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-white/65">{text}</p>}
      </Container>
    </section>
  );
}
