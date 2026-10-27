"use client";
import { useDeferredAnimation } from "@/components/use-deferred-animation";
import { useRef } from "react";
import { useNearViewport } from "@/components/use-near-viewport";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Message01Icon } from "@hugeicons/core-free-icons";
import { ContactButton } from "@/components/site-primitives";
import { experience } from "@/content/experience";

export function ExperienceIntroduction() {
  const root = useRef<HTMLElement>(null);
  const ready = useNearViewport(root, "150px");
  useDeferredAnimation(ready, () =>
    import("./introduction-animation").then(
      ({ mount }) =>
        () =>
          mount(root),
    ),
  );
  return (
    <section
      id="introduction"
      className="post-hero-intro experience-padding"
      ref={root}
      aria-labelledby="post-hero-title"
    >
      <div className="post-hero-layout">
        <div className="post-hero-copy">
          <p className="post-hero-eyebrow">
            <span className="intro-copy-full">
              {experience.introduction.label}
            </span>
            <span className="intro-copy-compact">Connected experiences</span>
          </p>
          <h2 id="post-hero-title">
            <span className="intro-copy-full">
              {experience.introduction.title.split("\n").map((line) => (
                <span className="post-hero-question-mask" key={line}>
                  <span className="post-hero-question-line">{line}</span>
                </span>
              ))}
            </span>
            <span className="intro-copy-compact">
              {experience.introduction.mobileTitle.split("\n").map((line) => (
                <span className="post-hero-question-mask" key={line}>
                  <span className="post-hero-question-line">{line}</span>
                </span>
              ))}
            </span>
          </h2>
          <p className="post-hero-description">
            <span className="intro-copy-full">
              {experience.introduction.text}
            </span>
            <span className="intro-copy-compact">
              {experience.introduction.mobileText}
            </span>
          </p>
        </div>
        <div
          className="post-hero-graphic"
          role="group"
          aria-label="Conversations, patient journeys and systems becoming one connected experience"
        >
          <svg
            className="post-hero-connections"
            viewBox="0 0 520 450"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              className="post-hero-connect-line"
              cx="275"
              cy="215"
              rx="145"
              ry="166"
              pathLength="1"
              stroke="#d1d3d8"
            />
          </svg>
          <div
            className="post-hero-column post-hero-column-left"
            aria-hidden="true"
          >
            <span className="post-hero-column-shaft" />
            <span className="post-hero-node post-hero-node-left" />
          </div>
          <div
            className="post-hero-column post-hero-progress"
            aria-hidden="true"
          >
            <span className="post-hero-progress-fill post-hero-column-shaft" />
            <span className="post-hero-node post-hero-node-top" />
          </div>
          <div
            className="post-hero-column post-hero-column-right"
            aria-hidden="true"
          >
            <span className="post-hero-column-shaft" />
            <span className="post-hero-node post-hero-node-right" />
          </div>
          <div className="post-hero-card post-hero-card-message">
            <span className="post-hero-card-icon">
              <HugeiconsIcon icon={Message01Icon} size={17} strokeWidth={1.4} />
            </span>
            <span>
              Conversations
              <br />
              <strong>connected.</strong>
            </span>
          </div>
          <div className="post-hero-card post-hero-card-patient">
            <span className="post-hero-card-icon">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={17}
                strokeWidth={1.4}
              />
            </span>
            <span>
              Patient journeys
              <br />
              <strong>simplified.</strong>
            </span>
          </div>
          <div className="post-hero-outcome">
            <span className="sr-only">
              10% reduction in appointment no-shows in a published Synapse
              hospital case.
            </span>
            <div className="post-hero-outcome-value" aria-hidden="true">
              <span className="post-hero-digit-mask">
                <span className="post-hero-tens-reel">
                  <span>0</span>
                  <span>1</span>
                </span>
              </span>
              <span className="post-hero-digit-mask">
                <span className="post-hero-ones-reel">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit, index) => (
                    <span key={index}>{digit}</span>
                  ))}
                </span>
              </span>
              <span className="post-hero-percent">%</span>
            </div>
            <span className="post-hero-outcome-track" aria-hidden="true">
              <span className="post-hero-outcome-fill" />
            </span>
            <p>fewer appointment no-shows</p>
            <Link href="/synapse">Published hospital case ↗</Link>
          </div>
          <span className="post-hero-graphic-caption">
            One connected experience.
          </span>
        </div>
      </div>
      <div className="post-hero-resolution">
        <p>Together, we can change that.</p>
        <ContactButton>Let’s connect the dots</ContactButton>
      </div>
    </section>
  );
}
