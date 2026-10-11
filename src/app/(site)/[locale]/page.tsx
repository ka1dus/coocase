import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Armchair, Droplets, Feather, Frame, KeyRound, Layers, Lock, Plane, Shield, VolumeX, type LucideIcon } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { href } from "@/lib/paths";
import { categoryOrder, categoryPhoto, products } from "@/data/products";
import { distributors } from "@/data/distributors";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import ProductCard from "@/components/ProductCard";
import MapTeaser from "@/components/MapTeaser";
import ProductImage from "@/components/ProductImage";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  const t = getDictionary(locale);
  const featured = products.filter((p) => p.featured);
  const countries = new Set(distributors.map((d) => d.country)).size;
  const innovationIcons = [Lock, Armchair, Plane, Droplets];
  const anatomyIcons: LucideIcon[] = [KeyRound, Droplets, Shield, Frame, Feather, Layers, VolumeX, Lock];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-carbon text-brand-white">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-brand-red clip-slant lg:block" aria-hidden />
        <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 border border-brand-white/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-brand-white/70">
              <Lock size={12} className="text-brand-red" />
              {t.home.badge}
            </span>
            <h1 className="mt-8 font-display text-6xl font-bold uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
              {[t.home.heroTitle1, t.home.heroTitle2].filter(Boolean).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block text-brand-red">{t.home.heroTitle3}</span>
            </h1>
            <p className="mt-8 max-w-lg leading-relaxed text-brand-white/65">{t.home.heroText}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href={href(locale, "/products")}>{t.common.exploreCatalog}</ButtonLink>
              <ButtonLink href={href(locale, "/contact")} variant="outline">
                {t.common.contactUs}
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/life/fuji-cover.webp"
                alt="COOCASE aluminium top and side cases on an adventure motorcycle by a lake"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <span className="absolute right-0 top-0 bg-brand-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-carbon">
                {t.home.catalogueLabel}
              </span>
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 bg-brand-white px-4 py-3 text-brand-carbon shadow-xl sm:left-6">
              <Lock size={16} className="text-brand-red" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-steel">{t.home.signature}</p>
                <p className="text-sm font-semibold">{t.home.signatureName}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-b border-brand-line bg-brand-white py-4" aria-hidden>
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-brand-carbon/70">
          {[...t.home.ticker, ...t.home.ticker].map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              {item}
              <span className="text-brand-red">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* Innovations */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow={t.home.innovationsEyebrow} title={t.home.innovationsTitle} />
          <div className="mt-12 grid border border-brand-line sm:grid-cols-2 lg:grid-cols-4">
            {t.home.innovations.map((item, i) => {
              const Icon = innovationIcons[i];
              return (
                <div key={item.title} className="border-brand-line p-7 max-lg:border-b sm:odd:border-r lg:border-r lg:last:border-r-0">
                  <span className="font-mono text-xs text-brand-steel">0{i + 1}</span>
                  <Icon size={22} className="mt-5 text-brand-red" />
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-steel">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured */}
      <section className="bg-brand-mist py-20 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle} text={t.home.featuredText} />
            <ButtonLink href={href(locale, "/products")} variant="outline-dark">
              {t.home.fullCatalog}
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Anatomy */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading eyebrow={t.home.anatomyEyebrow} title={t.home.anatomyTitle} text={t.home.anatomyText} />
            <div className="relative mt-10 aspect-[5/4] overflow-hidden bg-brand-mist">
              <Image
                src="/images/life/38kl-open.webp"
                alt="COOCASE aluminium top case and side cases on an adventure motorcycle"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <ol className="grid gap-px border border-brand-line bg-brand-line sm:grid-cols-2">
            {t.anatomy.map((f, i) => {
              const Icon = anatomyIcons[i] ?? Lock;
              return (
              <li key={f.title} className="flex gap-4 bg-brand-white p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-brand-line bg-brand-mist text-brand-red">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    <span className="mr-2 font-mono text-xs text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-brand-steel">{f.text}</p>
                </div>
              </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Categories */}
      <section className="bg-brand-mist py-20 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t.home.categoriesEyebrow} title={t.home.categoriesTitle} />
            <Link
              href={href(locale, "/products")}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brand-red"
            >
              {t.home.fullCatalog} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryOrder.map((c) => (
              <Link
                key={c}
                href={`${href(locale, "/products")}?category=${c}`}
                className="group flex flex-col overflow-hidden border border-brand-line bg-white transition-colors hover:border-brand-carbon"
              >
                <div className="relative aspect-[16/10]">
                  <ProductImage
                    src={categoryPhoto(c)}
                    alt={t.categories[c].name}
                    category={c}
                    compact
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 bg-brand-carbon p-5 text-brand-white transition-colors group-hover:bg-brand-graphite">
                  <h3 className="flex items-center justify-between font-display text-xl font-bold uppercase">
                    {t.categories[c].name}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="mt-1 text-sm text-brand-white/65">{t.categories[c].text}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Network */}
      <section className="bg-brand-carbon py-20 text-brand-white sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading dark eyebrow={t.home.networkEyebrow} title={t.home.networkTitle} text={t.home.networkText} />
            <dl className="mt-10 grid grid-cols-3 border-y border-brand-white/10">
              {[
                { v: "38", l: t.home.statCountries },
                { v: `${new Date().getFullYear() - 2006}`, l: t.home.statYears },
                { v: "30+", l: t.home.statSizes },
              ].map((s) => (
                <div key={s.l} className="py-6 pr-4">
                  <dt className="font-display text-4xl font-bold text-brand-red">{s.v}</dt>
                  <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-white/50">{s.l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <ButtonLink href={href(locale, "/distributors")}>{t.home.networkCta}</ButtonLink>
            </div>
          </div>
          <MapTeaser count={countries} />
        </Container>
      </section>

      {/* Manufacturing */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow={t.home.manufacturingEyebrow} title={t.home.manufacturingTitle} text={t.home.manufacturingText} />
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {["robot", "laser", "press", "bending"].map((img, i) => (
              <div key={img} className={`relative overflow-hidden bg-brand-mist ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/5] lg:mt-10"}`}>
                <Image src={`/images/factory/${img}.webp`} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-carbon py-20 text-center text-brand-white sm:py-24">
        <Image src="/images/life/sakura-rear.webp" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <Container className="relative">
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">{t.home.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-white/65">{t.home.ctaText}</p>
          <div className="mt-8">
            <ButtonLink href={href(locale, "/contact")}>{t.home.ctaButton}</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
