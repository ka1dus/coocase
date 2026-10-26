import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Armchair, Droplets, Lock, Plane } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { format, getDictionary } from "@/i18n";
import { href } from "@/lib/paths";
import { productText } from "@/lib/productText";
import { categoryOrder, categoryPhoto, getProduct, photo, products, type Product } from "@/data/products";
import { distributors } from "@/data/distributors";
import { ButtonLink, Container } from "@/components/ui";
import MapTeaser from "@/components/MapTeaser";
import HeroSpotlight, { type HeroSlide } from "@/components/home/HeroSpotlight";
import ProductCarousel from "@/components/home/ProductCarousel";

/** Section title in the luxury style: thin red rule + mono label, large display heading. */
function Heading({ eyebrow, title, text, dark = false }: { eyebrow?: string; title: string; text?: string; dark?: boolean }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow rule">{eyebrow}</p>}
      <h2 className={`mt-4 font-display text-4xl font-bold uppercase leading-[0.95] sm:text-5xl ${dark ? "text-brand-white" : ""}`}>{title}</h2>
      {text && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-brand-white/60" : "text-brand-steel"}`}>{text}</p>}
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  const t = getDictionary(locale);
  const pt = productText(t, locale);
  const featured = products.filter((p) => p.featured);
  const countries = new Set(distributors.map((d) => d.country)).size;
  const innovationIcons = [Lock, Armchair, Plane, Droplets];
  const pick = (slug: string) => getProduct(slug) as Product;

  const slide = (slug: string, image: string): HeroSlide => {
    const p = pick(slug);
    return {
      image,
      eyebrow: p.badge ? t.badges[p.badge] : t.categories[p.category].short,
      title: pt.name(p),
      text: [p.volume, pt.kind(p)].filter(Boolean).join(" · "),
      href: href(locale, `/products/${slug}`),
    };
  };
  const slides = [
    slide("keyless-aluminium-top-case", photo("keyless-aluminium-top-case", "g01")),
    slide("keyless-tass-backrest-top-case", photo("keyless-tass-backrest-top-case", "g03")),
    slide("keyless-wheel-top-case", photo("keyless-wheel-top-case", "g07")),
  ];

  const promos = [
    { p: pick("key-tass-backrest-top-case"), image: photo("key-tass-backrest-top-case", "g02") },
    { p: pick("key-wheel-top-case"), image: photo("key-wheel-top-case", "g03") },
  ];
  const spotlight = pick("keyless-aluminium-top-case");
  const count = (c: (typeof categoryOrder)[number]) => products.filter((p) => p.category === c).length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative -mt-16 overflow-hidden bg-brand-carbon pt-16 text-brand-white">
        <div className="absolute inset-0" aria-hidden>
          <Image src="/images/life/fuji-cover.webp" alt="" fill priority sizes="100vw" className="animate-kenburns object-cover opacity-25 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-carbon via-brand-carbon/85 to-brand-carbon/40" />
          <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-brand-red/90 clip-slant lg:block" />
        </div>
        <Container className="relative grid min-h-[calc(100svh-4rem)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 border border-brand-white/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-brand-white/70">
              <Lock size={12} className="text-brand-red" />
              {t.home.badge}
            </span>
            <h1 className="mt-8 font-display text-6xl font-bold uppercase leading-[0.88] sm:text-7xl xl:text-[7.5rem]">
              {[t.home.heroTitle1, t.home.heroTitle2].filter(Boolean).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block text-brand-red">{t.home.heroTitle3}</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-brand-white/65">{t.home.heroText}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href={href(locale, "/products")}>{t.common.exploreCatalog}</ButtonLink>
              <ButtonLink href={href(locale, "/distributors")} variant="outline">
                {t.home.networkCta}
              </ButtonLink>
            </div>
            <dl className="mt-14 hidden max-w-md grid-cols-3 border-t border-brand-white/15 pt-6 sm:grid">
              {[
                { v: "2006", l: t.about.statFounded },
                { v: "38", l: t.home.statCountries },
                { v: "40+", l: t.home.statSizes },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl font-bold">{s.v}</dt>
                  <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-white/45">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="animate-rise [animation-delay:150ms]">
            <HeroSpotlight slides={slides} />
          </div>
        </Container>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-brand-red py-4 text-brand-white" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em]">
          {[...t.home.ticker, ...t.home.ticker].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item}
              <span className="h-1.5 w-1.5 rotate-45 bg-brand-white" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Category mosaic ─────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading eyebrow={t.home.categoriesEyebrow} title={t.home.categoriesTitle} />
            <Link href={href(locale, "/products")} className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brand-red">
              {t.home.fullCatalog} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-14 grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:auto-rows-[300px] lg:grid-cols-4">
            {categoryOrder.map((c, i) => (
              <Link
                key={c}
                href={`${href(locale, "/products")}?category=${c}`}
                className={`stage group relative overflow-hidden ${i === 0 ? "sm:col-span-2 sm:row-span-2" : i === 3 ? "sm:col-span-2" : ""}`}
              >
                {categoryPhoto(c) && (
                  <Image
                    src={categoryPhoto(c)!}
                    alt=""
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon/90 via-brand-carbon/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-brand-white sm:p-8">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-white/60">
                      {String(i + 1).padStart(2, "0")} · {format(t.catalog.results, { count: count(c) })}
                    </p>
                    <h3 className={`mt-2 font-display font-bold uppercase leading-none ${i === 0 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>
                      {t.categories[c].name}
                    </h3>
                    {i === 0 && <p className="mt-3 max-w-sm text-sm text-brand-white/70">{t.categories[c].text}</p>}
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-white text-brand-carbon transition-colors group-hover:bg-brand-red group-hover:text-brand-white">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Brand statement ─────────────────────────────────────────────── */}
      <section className="border-y border-brand-line bg-brand-mist py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow rule">{t.about.eyebrow}</p>
            <p className="mt-6 font-display text-5xl font-bold uppercase leading-[0.9] sm:text-7xl">
              {t.about.title1}
              <br />
              <span className="text-brand-red">{t.about.title2}</span>
            </p>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-brand-carbon/75">{t.about.p1}</p>
            <Link href={href(locale, "/about")} className="group mt-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-red">
              {t.common.learnMore}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Featured range carousel ─────────────────────────────────────── */}
      <section className="overflow-hidden py-24 sm:py-32">
        <Container>
          <Heading eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle} text={t.home.featuredText} />
          <div className="mt-6">
            <ProductCarousel products={featured} />
          </div>
        </Container>
      </section>

      {/* ── Keyless spotlight (dark) ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-carbon py-24 text-brand-white sm:py-32">
        <div className="absolute -left-40 top-0 h-full w-1/2 bg-brand-graphite clip-slant" aria-hidden />
        <Container className="relative grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="stage relative aspect-[4/3] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
              <Image
                src={photo("keyless-aluminium-top-case", "g03")}
                alt={pt.name(spotlight)}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-white/50">{t.home.signature}</p>
                <p className="mt-1 font-display text-xl font-bold uppercase">{t.home.signatureName}</p>
              </div>
              <ButtonLink href={href(locale, `/products/${spotlight.slug}`)}>{t.common.discover}</ButtonLink>
            </div>
          </div>
          <div>
            <Heading dark eyebrow={t.home.anatomyEyebrow} title={t.home.anatomyTitle} text={t.home.anatomyText} />
            <ol className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {t.anatomy.map((f, i) => (
                <li key={f.title} className="border-t border-brand-white/10 py-5">
                  <p className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-semibold">{f.title}</span>
                  </p>
                  <p className="mt-1.5 pl-8 text-sm leading-relaxed text-brand-white/55">{f.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── Innovations ─────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <Heading eyebrow={t.home.innovationsEyebrow} title={t.home.innovationsTitle} />
          <div className="mt-14 grid gap-px bg-brand-line sm:grid-cols-2 lg:grid-cols-4">
            {t.home.innovations.map((item, i) => {
              const Icon = innovationIcons[i];
              return (
                <div key={item.title} className="group relative bg-brand-white p-8 transition-colors hover:bg-brand-carbon hover:text-brand-white">
                  <span className="font-display text-6xl font-bold text-brand-line transition-colors group-hover:text-brand-white/10">0{i + 1}</span>
                  <Icon size={24} className="mt-6 text-brand-red" />
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-steel transition-colors group-hover:text-brand-white/60">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Promo banners ───────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <Container className="grid gap-4 lg:grid-cols-2">
          {promos.map(({ p, image }) => (
            <Link key={p.slug} href={href(locale, `/products/${p.slug}`)} className="stage group relative block aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
              <Image src={image} alt={pt.name(p)} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-brand-carbon/55 to-brand-carbon/5" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-center text-brand-white sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-white/70">{pt.kind(p)}</p>
                <h3 className="mt-3 font-display text-3xl font-bold uppercase sm:text-4xl">{pt.name(p)}</h3>
                <span className="mt-6 inline-flex items-center gap-3 bg-brand-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-carbon transition-colors group-hover:bg-brand-red group-hover:text-brand-white">
                  {t.common.discover} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </Container>
      </section>

      {/* ── Distribution network ────────────────────────────────────────── */}
      <section className="bg-brand-carbon py-24 text-brand-white sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Heading dark eyebrow={t.home.networkEyebrow} title={t.home.networkTitle} text={t.home.networkText} />
            <dl className="mt-10 grid grid-cols-3 border-y border-brand-white/10">
              {[
                { v: "38", l: t.home.statCountries },
                { v: `${new Date().getFullYear() - 2006}`, l: t.home.statYears },
                { v: "40+", l: t.home.statSizes },
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

      {/* ── Manufacturing ───────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <Heading eyebrow={t.home.manufacturingEyebrow} title={t.home.manufacturingTitle} text={t.home.manufacturingText} />
          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {["robot", "laser", "press", "bending"].map((img, i) => (
              <div key={img} className={`relative aspect-[4/5] overflow-hidden bg-brand-mist ${i % 2 ? "lg:mt-12" : ""}`}>
                <Image src={`/images/factory/${img}.webp`} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover grayscale transition-all duration-700 hover:grayscale-0" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-carbon py-28 text-center text-brand-white sm:py-36">
        <Image src="/images/life/sakura-rear.webp" alt="" fill sizes="100vw" className="object-cover opacity-20 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-carbon/40 to-brand-carbon" />
        <Container className="relative">
          <p className="eyebrow">COOCASE</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] sm:text-6xl">{t.home.ctaTitle}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-brand-white/65">{t.home.ctaText}</p>
          <div className="mt-10">
            <ButtonLink href={href(locale, "/contact")}>{t.home.ctaButton}</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
