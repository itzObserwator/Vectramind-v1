"use client";
import { useState } from "react";
import { SectionLabel } from "@/components/site-primitives";
import photos from "@/content/milestones.json";
const events = ["All moments", ...new Set(photos.map((photo) => photo.event))];
export function MilestoneArchive() {
  const [event, setEvent] = useState("All moments");
  const [limit, setLimit] = useState(6);
  const filtered = photos.filter(
    (photo) => event === "All moments" || photo.event === event,
  );
  return (
    <section
      className="milestone-archive page-padding inner-section"
      aria-labelledby="milestone-archive-title"
    >
      <SectionLabel>Our milestone moments</SectionLabel>
      <h2
        className="display inner-section-title"
        id="milestone-archive-title"
        data-reveal
      >
        Every memory.
        <br />
        <span className="brand-heading-accent">Part of our story.</span>
      </h2>
      <label className="milestone-picker">
        <span className="sr-only">Filter milestone photos</span>
        <select
          value={event}
          onChange={(event) => {
            setEvent(event.target.value);
            setLimit(6);
          }}
          aria-controls="milestone-photos"
        >
          {events.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <div
        className="milestone-filters"
        role="group"
        aria-label="Filter milestone photos"
      >
        {events.map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={event === name}
            onClick={() => {
              setEvent(name);
              setLimit(6);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="milestone-grid" id="milestone-photos">
        {filtered.slice(0, limit).map((photo, index) => (
          <figure key={photo.src}>
            <a
              href={photo.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${photo.caption} photo ${index + 1} in full (opens a new tab)`}
            >
              <div className="people-image">
                <img
                  src={photo.src}
                  alt={`${photo.caption} — Vectramind moment ${index + 1}`}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </a>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="milestone-more">
        <p aria-live="polite">
          Showing {Math.min(limit, filtered.length)} of {filtered.length}{" "}
          moments
        </p>
        {limit < filtered.length && (
          <button
            type="button"
            className="button hero-platform-button"
            onClick={() => setLimit((previous) => previous + 6)}
          >
            Show more moments
          </button>
        )}
      </div>
    </section>
  );
}
