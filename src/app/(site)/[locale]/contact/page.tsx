import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { company } from "@/data/company";
import { Container, PageHero } from "@/components/ui";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.contact.title, description: t.contact.text };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await resolveLocale(params);
  const heading = "font-mono text-[11px] uppercase tracking-[0.25em]";
  return (
    <>
      <PageHero eyebrow={t.contact.eyebrow} title={t.contact.title} text={t.contact.text} image="/images/life/expo.webp" />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className={heading}>{t.contact.direct}</h2>
          <ul className="mt-4 space-y-3">
            {company.emails.map((e) => (
              <li key={e}>
                <a href={`mailto:${e}`} className="flex items-center gap-3 border border-brand-line px-4 py-3 text-sm transition-colors hover:border-brand-red hover:text-brand-red">
                  <Mail size={16} className="text-brand-red" /> {e}
                </a>
              </li>
            ))}
            <li>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 border border-brand-line px-4 py-3 text-sm transition-colors hover:border-brand-red hover:text-brand-red">
                <Phone size={16} className="text-brand-red" /> {company.phone}
              </a>
            </li>
          </ul>
          <h2 className={`${heading} mt-10`}>{t.contact.offices}</h2>
          <ul className="mt-4 space-y-5">
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
        </div>
        <Suspense>
          <ContactForm />
        </Suspense>
      </Container>
    </>
  );
}
