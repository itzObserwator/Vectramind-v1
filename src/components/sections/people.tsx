"use client";

import { useRef, useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { SectionLabel } from "@/components/site-primitives";
export function People({
  includeFounder = true,
  sectionIndex = "07",
}: { includeFounder?: boolean; sectionIndex?: string } = {}) {
  const [slide, setSlide] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const images = [
    {
      src: "ceo_about.webp",
      label: "Dr. Murali Krishna Vakalapudi",
      caption: "Founder & CEO",
    },
    {
      src: "milestone-01.jpg",
      label: "Ideas that bring us together",
      caption: "A milestone moment for Vectramind",
      alt: "Vectramind’s founder at a meeting in Dubai",
      wide: true,
    },
    {
      src: "event-31.webp",
      label: "A global perspective",
      caption: "Team Vectramind",
    },
    {
      src: "career.webp",
      label: "Curious minds. Shared purpose.",
      caption: "Life at Vectramind",
    },
  ].filter((_, index) => includeFounder || index !== 0);
  function selectPhoto(index: number) {
    const next = Math.max(0, Math.min(images.length - 1, index));
    const slider = ref.current;
    const photo = slider?.children[next];
    if (!slider || !photo) return;
    let left =
      slider.scrollLeft +
      photo.getBoundingClientRect().left -
      slider.getBoundingClientRect().left;
    // Several desktop photos can be visible together. If a requested photo
    // would clamp at the current edge, move back through the visible group.
    const maximum = slider.scrollWidth - slider.clientWidth;
    if (next < slide && Math.min(left, maximum) >= slider.scrollLeft - 2)
      left = Math.max(0, slider.scrollLeft - slider.clientWidth * 0.8);
    setSlide(next);
    slider.scrollTo({
      left,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section className="people page-padding section-space">
      <SectionLabel right={`${sectionIndex} / The minds behind the momentum`}>
        Meet Vectramind
      </SectionLabel>
      <div className="people-heading">
        <h2 className="display" data-reveal>
          Great minds.
          <br />
          <span className="brand-heading-accent">Human at heart.</span>
        </h2>
        <div className="slider-controls">
          <button
            aria-label="Previous team photo"
            onClick={() => selectPhoto(slide - 1)}
            disabled={slide === 0}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={22}
              className="rotate-180"
            />
          </button>
          <button
            aria-label="Next team photo"
            onClick={() => selectPhoto(slide + 1)}
            disabled={slide === images.length - 1}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={22} />
          </button>
        </div>
      </div>
      <div
        className="people-slider"
        ref={ref}
        role="region"
        aria-label="Vectramind team photos"
        tabIndex={0}
        onScroll={(event) => {
          const slider = event.currentTarget;
          if (
            slider.scrollLeft + slider.clientWidth >=
            slider.scrollWidth - 2
          ) {
            setSlide(images.length - 1);
            return;
          }
          const left = slider.getBoundingClientRect().left;
          const closest = Array.from(slider.children).reduce(
            (best, photo, index, photos) =>
              Math.abs(photo.getBoundingClientRect().left - left) <
              Math.abs(photos[best].getBoundingClientRect().left - left)
                ? index
                : best,
            0,
          );
          setSlide(closest);
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            selectPhoto(
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? images.length - 1
                  : slide + (event.key === "ArrowRight" ? 1 : -1),
            );
          }
        }}
      >
        {images.map((item) => (
          <figure
            key={item.src}
            className={item.wide ? "people-photo-wide" : undefined}
          >
            <div className="people-image">
              <img
                src={`/images/${item.src}`}
                alt={item.alt || item.label}
                loading="lazy"
              />
            </div>
            <figcaption>
              <strong>{item.label}</strong>
              <span>{item.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
