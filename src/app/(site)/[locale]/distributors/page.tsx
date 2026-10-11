import type { Metadata } from "next";
import { resolveLocale } from "@/lib/page";
import { href } from "@/lib/paths";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import DistributorsExplorer from "@/components/DistributorsExplorer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.distributors.title, description: t.distributors.text };
}

export default async function DistributorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <PageHero eyebrow={t.distributors.eyebrow} title={t.distributors.title} text={t.distributors.text} />
      <Container className="py-12 sm:py-16">
        <DistributorsExplorer />
      </Container>
      <section className="bg-brand-carbon text-brand-white">
        <Container className="flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase">{t.distributors.becomeTitle}</h2>
            <p className="mt-3 max-w-xl text-brand-white/65">{t.distributors.becomeText}</p>
          </div>
          <ButtonLink href={`${href(locale, "/contact")}?interest=distributor`}>{t.distributors.becomeCta}</ButtonLink>
        </Container>
      </section>
    </>
  );
}
