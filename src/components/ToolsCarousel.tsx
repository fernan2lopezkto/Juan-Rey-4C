"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Tool } from "@/data/tools";

interface Props {
  tools: Tool[];
}

export default function ToolsCarousel({ tools }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 1024px)": { slidesToScroll: 1 }
      }
    }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group max-w-6xl mx-auto">
      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 py-8"
            >
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300 group/card h-full">
                <figure className="relative h-48 overflow-hidden">
                  <img 
                    src={tool.image} 
                    alt={tool.title}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="badge badge-primary font-bold shadow-lg">{tool.badge}</div>
                  </div>
                </figure>
                <div className="card-body flex flex-col justify-between">
                  <div>
                    <h2 className="card-title text-2xl font-bold group-hover/card:text-primary transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-base-content/70 leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <Link 
                      href={tool.href} 
                      className="btn btn-primary btn-md group-hover/card:shadow-lg transition-all"
                    >
                      Entrar ahora
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 btn btn-circle btn-ghost bg-base-100/50 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden xl:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 btn btn-circle btn-ghost bg-base-100/50 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden xl:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index 
                ? "bg-primary w-8" 
                : "bg-base-content/20 hover:bg-base-content/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
