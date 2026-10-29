"use client";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
export function FaqList({
  items,
  searchable = false,
  showResultCount = false,
}: {
  items: readonly (readonly [string, string])[];
  searchable?: boolean;
  showResultCount?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) =>
    item.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="faq-list">
      {searchable && (
        <label className="faq-search">
          <span className="eyebrow">Find an answer</span>
          <span className="faq-search-control">
            <HugeiconsIcon
              icon={Search01Icon}
              size={20}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search questions, products, integrations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </span>
        </label>
      )}
      {showResultCount && (
        <p className="faq-result-count" role="status">
          {filtered.length} {filtered.length === 1 ? "answer" : "answers"}
          {query ? " matching your search" : " to explore"}
        </p>
      )}
      <div aria-live="polite">
        {filtered.length === 0 && (
          <p className="empty-results">
            No matching answers. Try another search or contact our team.
          </p>
        )}
        {filtered.map(([question, answer], i) => (
          <details key={question}>
            <summary>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              {question}
              <span className="faq-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
