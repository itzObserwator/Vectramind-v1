"use client";
import { useId, useState } from "react";
import { SynapseCopy as ResponsiveCopy } from "./synapse-copy";
import { FaqList } from "./faq-list";
import { supportGroups } from "@/content/support";

export function SupportAnswers() {
  const [selected, setSelected] = useState(0);
  const prefix = useId();
  const group = supportGroups[selected];
  return (
    <div className="support-answers">
      <div
        className="support-answer-tabs"
        role="tablist"
        aria-label="Browse support topics"
      >
        {supportGroups.map((item, index) => (
          <button
            key={item.id}
            id={`${prefix}-${item.id}`}
            role="tab"
            type="button"
            aria-selected={selected === index}
            aria-controls={`${prefix}-panel`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? supportGroups.length - 1
                    : (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        supportGroups.length) %
                      supportGroups.length;
              setSelected(next);
              document
                .getElementById(`${prefix}-${supportGroups[next].id}`)
                ?.focus();
            }}
          >
            {index === 0 ? (
              <ResponsiveCopy compact="All">{item.label}</ResponsiveCopy>
            ) : (
              item.label
            )}
          </button>
        ))}
      </div>
      <div
        id={`${prefix}-panel`}
        role="tabpanel"
        aria-labelledby={`${prefix}-${group.id}`}
      >
        <FaqList items={group.items} searchable showResultCount />
      </div>
    </div>
  );
}
