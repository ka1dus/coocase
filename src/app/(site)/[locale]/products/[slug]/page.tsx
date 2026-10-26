import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { resolveLocale } from "@/lib/page";
import { getProduct, products } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";
import { productText } from "@/lib/productText";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await resolveLocale(params);
  const product = getProduct(slug);
  if (!product) return {};
  const pt = productText(t, locale);
  return {
    title: `${pt.name(product)} — ${pt.kind(product)}`,
    description: pt.desc(product),
    ...(product.images?.[0] && { openGraph: { images: [product.images[0]] } }),
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  await resolveLocale(params);
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  return <ProductDetail product={product} related={related} />;
}
