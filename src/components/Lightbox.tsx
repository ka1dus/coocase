"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";

export interface LightboxImage {
  src: string;
  caption?: string;
}

/** Full-screen image viewer with keyboard navigation. */
export function useLightbox(images: LightboxImage[]) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setIndex(i), []);
  const element = index === null ? null : <Lightbox images={images} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />;
  return { open, element };
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: LightboxImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const step = useCallback((d: number) => onIndex((index + d + images.length) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, step]);

  const img = images[index];
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-[2000] flex flex-col bg-black/95" onClick={onClose}>
      <div className="flex items-center justify-between p-4 text-brand-white/70">
        <span className="font-mono text-xs">
          {index + 1} / {images.length}
          {img.caption && <span className="ml-4 text-brand-white">{img.caption}</span>}
        </span>
        <button aria-label={t.common.close} className="p-2 hover:text-brand-white" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <Image src={img.src} alt={img.caption ?? ""} fill sizes="100vw" className="object-contain" />
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-4 p-4" onClick={(e) => e.stopPropagation()}>
          <button aria-label="Previous" onClick={() => step(-1)} className="border border-brand-white/20 p-3 text-brand-white hover:border-brand-white">
            <ChevronLeft size={20} />
          </button>
          <button aria-label="Next" onClick={() => step(1)} className="border border-brand-white/20 p-3 text-brand-white hover:border-brand-white">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
