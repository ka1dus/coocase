import Image from "next/image";
import { Archive, Briefcase, Luggage, Package, type LucideIcon } from "lucide-react";
import { isPlaceholderPhoto, type CategoryId } from "@/data/products";

const categoryIcon: Record<CategoryId, LucideIcon> = {
  "aluminium-topcase": Briefcase,
  "aluminium-sidecase": Archive,
  "plastic-topcase": Package,
  specialty: Luggage,
};

/**
 * A product photo, or a branded placeholder when no photo has been added yet.
 * Placeholders show the category icon, the product title and "image coming soon".
 */
export default function ProductImage({
  src,
  alt,
  category,
  title,
  subtitle,
  comingSoon,
  sizes = "(min-width: 1024px) 33vw, 50vw",
  priority,
  compact = false,
  className = "object-contain p-6",
}: {
  src?: string;
  alt: string;
  category: CategoryId;
  title?: string;
  subtitle?: string;
  comingSoon?: string;
  sizes?: string;
  priority?: boolean;
  /** Small tiles: icon only. */
  compact?: boolean;
  className?: string;
}) {
  if (src) {
    // Stock placeholder photos are full scenes, so they fill the frame instead of being contained.
    const fit = isPlaceholderPhoto(src) ? className.replace(/object-contain|p-\d+/g, "") + " object-cover" : className;
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={fit} />;
  }

  const Icon = categoryIcon[category];
  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden bg-brand-mist text-center"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgb(18 18 18 / 0.035) 14px 15px)",
      }}
    >
      <span className={`flex items-center justify-center border border-brand-line bg-brand-white text-brand-red ${compact ? "h-9 w-9" : "h-14 w-14"}`}>
        <Icon size={compact ? 18 : 26} strokeWidth={1.5} />
      </span>
      {!compact && title && (
        <span className="px-4">
          <span className="block font-display text-lg font-bold uppercase leading-tight text-brand-carbon/80">{title}</span>
          {subtitle && <span className="mt-0.5 block text-xs text-brand-steel">{subtitle}</span>}
        </span>
      )}
      {!compact && comingSoon && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-steel">{comingSoon}</span>
      )}
    </div>
  );
}
