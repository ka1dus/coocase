import type { Metadata } from "next";
import { Suspense } from "react";
import { resolveLocale } from "@/lib/page";
import { Container, PageHero } from "@/components/ui";
import CatalogBrowser from "@/components/CatalogBrowser";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.catalog.title, description: t.catalog.text };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await resolveLocale(params);
  return (
    <>
      <PageHero eyebrow={t.catalog.eyebrow} title={t.catalog.title} text={t.catalog.text} />
      <Container className="py-12 sm:py-16">
        <Suspense>
          <CatalogBrowser />
        </Suspense>
      </Container>
    </>
  );
}
