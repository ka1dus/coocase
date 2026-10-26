"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/provider";

export interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
}

const INTERVAL = 6500;

/** Rotating product spotlight shown on the right of the home hero. */
export default function HeroSpotlight({ slides }: { slides: HeroSlide[] }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((d: number) => setIndex((i) => (i + d + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, go, slides.length]);

  const slide = slides[index];

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="stage relative aspect-[4/3] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
        {slides.map((s, i) => (
          <Image
            key={s.image}
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover transition-all duration-1000 ease-out ${i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
          />
        ))}
        <span className="absolute left-0 top-5 bg-brand-red px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-white">
          {slide.eyebrow}
        </span>
      </div>

      {/* Caption panel overlapping the image */}
      <div className="relative -mt-10 ml-6 mr-0 bg-brand-white p-6 text-brand-carbon shadow-2xl sm:ml-16">
        <div key={index} className="animate-rise">
          <h3 className="font-display text-2xl font-bold uppercase leading-tight">{slide.title}</h3>
          <p className="mt-1 text-sm text-brand-steel">{slide.text}</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <Link
            href={slide.href}
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-brand-red hover:underline"
          >
            {t.common.viewDetails} <ArrowRight size={14} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden gap-1.5 sm:flex">
              {slides.map((s, i) => (
                <button
                  key={s.image}
                  aria-label={`${i + 1} / ${slides.length}`}
                  onClick={() => setIndex(i)}
                  className="relative h-1 w-8 overflow-hidden bg-brand-line"
                >
                  <span
                    key={i === index ? `active-${index}` : "idle"}
                    className={`absolute inset-y-0 left-0 bg-brand-red ${i < index ? "w-full" : "w-0"}`}
                    style={
                      i === index
                        ? { animation: `fill-bar ${INTERVAL}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }
                        : undefined
                    }
                  />
                </button>
              ))}
            </div>
            <button aria-label={t.common.previous} onClick={() => go(-1)} className="flex h-9 w-9 items-center justify-center border border-brand-line hover:border-brand-carbon">
              <ChevronLeft size={16} />
            </button>
            <button aria-label={t.common.next} onClick={() => go(1)} className="flex h-9 w-9 items-center justify-center bg-brand-carbon text-brand-white hover:bg-brand-red">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
