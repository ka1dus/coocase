"use client";

import { useI18n } from "@/i18n/provider";
import { href } from "@/lib/paths";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <Container className="py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-5xl font-bold uppercase">{t.common.noResults}</h1>
      <div className="mt-10 flex justify-center gap-3">
        <ButtonLink href={href(locale)}>{t.nav.home}</ButtonLink>
        <ButtonLink href={href(locale, "/products")} variant="outline-dark">{t.nav.catalog}</ButtonLink>
      </div>
    </Container>
  );
}
