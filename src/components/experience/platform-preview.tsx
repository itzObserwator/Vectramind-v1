import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Mail01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";

function PreviewLines() {
  return (
    <svg
      className="platform-art-lines"
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      fill="none"
    >
      {Array.from({ length: 7 }, (_, index) => (
        <path
          key={index}
          d={`M ${-100 + index * 12} 540 C 70 ${190 + index * 13}, 650 ${590 - index * 11}, ${690 + index * 15} -40`}
        />
      ))}
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path
        d="m4 8 2.5 2.5L12 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lightweight, editable product illustrations, shared by the landing and product pages.
export function PlatformPreview({
  platform,
}: {
  platform: "synapse" | "firstpass";
}) {
  const synapse = platform === "synapse";
  return (
    <div
      className={`platform-thumbnail platform-thumbnail-${platform}`}
      aria-hidden="true"
    >
      <PreviewLines />
      <div className="platform-art-composition">
        <div className="platform-art-header">
          <img
            className="platform-thumbnail-brand"
            src={`/images/${platform}.svg`}
            alt=""
            width="150"
            height="40"
            loading="lazy"
          />
          <span className="platform-art-index">
            {synapse ? "01 / CONVERSATIONS" : "02 / CARE JOURNEYS"}
          </span>
        </div>
        <p className="platform-art-copy">
          {synapse
            ? "Every channel. One conversation."
            : "A little less friction. A lot more care."}
        </p>
        <div
          className={`platform-art-workspace ${synapse ? "synapse-workspace" : "firstpass-workspace"}`}
        >
          <div className="platform-workspace-bar">
            <span className="platform-window-controls">
              <i />
              <i />
              <i />
            </span>
            <span>
              {synapse
                ? "Your connected workspace"
                : "Your connected care journey"}
            </span>
            <span className="platform-workspace-status">
              <i /> {synapse ? "In sync" : "With you"}
            </span>
          </div>
          {synapse ? (
            <div className="synapse-conversation-layout">
              <div className="synapse-channel-list">
                <small>CHANNELS</small>
                <span className="synapse-channel-selected">
                  <HugeiconsIcon icon={Message01Icon} size={18} /> WhatsApp{" "}
                  <i />
                </span>
                <span>
                  <HugeiconsIcon icon={Message01Icon} size={18} /> SMS
                </span>
                <span>
                  <HugeiconsIcon icon={Mail01Icon} size={18} /> Email
                </span>
                <div className="synapse-channel-note">
                  <span className="platform-context-mark">∞</span>
                  <p>
                    One view.
                    <br />
                    All the context.
                  </p>
                </div>
              </div>
              <div className="synapse-conversation">
                <div className="synapse-conversation-heading">
                  <span className="platform-person-avatar">S</span>
                  <div>
                    <strong>One conversation.</strong>
                    <span>Connected across every channel.</span>
                  </div>
                  <span className="synapse-thread-menu">···</span>
                </div>
                <div className="synapse-message synapse-message-incoming">
                  A little help finding the right plan?
                </div>
                <div className="synapse-message synapse-message-outgoing">
                  Of course. Let’s find what works for you.
                  <Check />
                </div>
                <div className="synapse-context">
                  <span />
                  <small>Context travels with the conversation</small>
                  <span />
                </div>
                <div className="synapse-compose">
                  <span>Keep the conversation going…</span>
                  <span className="synapse-send">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="firstpass-journey-layout">
              <div className="firstpass-care-photo">
                <img
                  src="/images/firstpass-reception.webp"
                  alt=""
                  width="1122"
                  height="1402"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <span>People first.</span>
                  <strong>At every step.</strong>
                </div>
              </div>
              <div className="firstpass-care-plan">
                <div className="firstpass-care-heading">
                  <small>YOUR NEXT VISIT</small>
                  <h4>You’re expected.</h4>
                </div>
                <div className="firstpass-appointment-summary">
                  <span className="firstpass-calendar">
                    <HugeiconsIcon icon={Calendar03Icon} size={22} />
                  </span>
                  <div>
                    <strong>10:30 AM</strong>
                    <span>Outpatient consultation</span>
                  </div>
                  <span className="firstpass-appointment-check">
                    <Check />
                  </span>
                </div>
                <div className="firstpass-journey-steps">
                  <div className="firstpass-step-complete">
                    <span>
                      <Check />
                    </span>
                    <div>
                      <strong>Appointment booked</strong>
                      <small>One less thing to think about.</small>
                    </div>
                  </div>
                  <div className="firstpass-step-current">
                    <span>02</span>
                    <div>
                      <strong>A simpler check-in</strong>
                      <small>Everything ready, before you arrive.</small>
                    </div>
                  </div>
                  <div>
                    <span>03</span>
                    <div>
                      <strong>Your care team, connected</strong>
                      <small>More time for what matters.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="platform-art-caption">
          <span>
            {synapse
              ? "Many touchpoints. One human experience."
              : "From the first hello to the next step."}
          </span>
          <span className="platform-art-signature">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
