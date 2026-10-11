import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { href } from "@/lib/paths";
import { company } from "@/data/company";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.nav.about, description: t.about.p1 };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const factory = ["robot", "laser", "bending", "press"];

  return (
    <>
      <section className="relative overflow-hidden bg-brand-carbon text-brand-white">
        <Image src="/images/life/sakura-cover.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-brand-red clip-slant md:block" aria-hidden />
        <Container className="relative py-20 sm:py-28">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] sm:text-6xl">
            {t.about.title1}
            <br />
            {t.about.title2}
          </h1>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-brand-carbon/80">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-brand-line bg-brand-mist p-6">
              <p className="font-display text-4xl font-bold text-brand-red">{company.founded}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-steel">{t.about.statFounded}</p>
            </div>
            <div className="border border-brand-line bg-brand-mist p-6">
              <p className="font-display text-4xl font-bold text-brand-red">{company.countries}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-steel">{t.about.statCountries}</p>
            </div>
          </div>
          <div className="border border-brand-line p-6">
            <h2 className="font-display text-xl font-bold uppercase">{t.about.philosophyTitle}</h2>
            <p className="mt-2 text-sm text-brand-steel">{t.about.philosophyText}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/life/38kl-open.webp" alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </Container>

      <section className="bg-brand-mist py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t.home.manufacturingEyebrow} title={t.about.manufacturingTitle} text={t.home.manufacturingText} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.about.manufacturing.map((item, i) => (
              <div key={item} className="border border-brand-line bg-brand-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={`/images/factory/${factory[i]}.webp`} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <span className="font-mono text-xs text-brand-red">0{i + 1}</span>
                  <p className="mt-2 text-sm leading-relaxed">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5]">
          <Image src="/images/life/expo.webp" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" />
        </div>
        <div>
          <SectionHeading eyebrow="COOCASE" title={t.about.expoTitle} text={t.about.expoText} />
          <h3 className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em]">{t.about.officesTitle}</h3>
          <ul className="mt-4 space-y-4">
            {company.offices.map((o) => (
              <li key={o.key} className="flex gap-3 border-l-2 border-brand-red pl-4">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-red" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-steel">{t.offices[o.key].label}</p>
                  <p className="text-sm font-semibold">{t.offices[o.key].name}</p>
                  <p className="text-sm text-brand-steel">{o.address}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={href(locale, "/distributors")}>{t.home.networkCta}</ButtonLink>
          </div>
        </div>
      </Container>

      <section className="bg-brand-carbon py-16 text-center text-brand-white">
        <Container>
          <p className="eyebrow">{t.about.ctaEyebrow}</p>
          <div className="mt-6">
            <ButtonLink href={href(locale, "/products")}>{t.common.exploreCatalog}</ButtonLink>
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-xs text-brand-white/40">{t.common.patentNotice}</p>
        </Container>
      </section>
    </>
  );
}
