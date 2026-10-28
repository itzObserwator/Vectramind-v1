"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

type Message = {
  sender: "assistant" | "visitor";
  text: string;
  links?: { label: string; href: string }[];
};
const welcome: Message[] = [
  { sender: "assistant", text: "Welcome to the Vectramind Help Desk." },
  { sender: "assistant", text: "May we have your name, please?" },
];
const topics = [
  "Explore Synapse",
  "Explore Firstpass",
  "Connect my systems",
  "Get support",
];
function answer(text: string): Message {
  if (/firstpass|patient|appointment|hospital|healthcare|clinic/i.test(text))
    return {
      sender: "assistant",
      text: "Firstpass connects the patient journey — from appointment scheduling and patient flow to ongoing communication. Explore the platform or tell our team about your healthcare needs.",
      links: [
        { label: "Explore Firstpass", href: "/firstpass" },
        {
          label: "Request a Firstpass demo",
          href: "/support?topic=firstpass#support-request",
        },
      ],
    };
  if (
    /synapse|whatsapp|sms|rcs|messaging|campaign|customer|email channel|omnichannel/i.test(
      text,
    )
  )
    return {
      sender: "assistant",
      text: "Synapse brings your customer conversations together across SMS, RCS, WhatsApp, email and more. One platform to create more connected customer experiences.",
      links: [
        { label: "Explore Synapse", href: "/synapse" },
        {
          label: "Request a Synapse demo",
          href: "/support?topic=synapse#support-request",
        },
      ],
    };
  if (/integrat|systems|connect my|api|crm|emr|database/i.test(text))
    return {
      sender: "assistant",
      text: "We connect your platforms, APIs, databases and EMRs with bi-directional integrations. Tell our team which systems you want to bring together, and we can discuss the right approach.",
      links: [
        { label: "Explore our capabilities", href: "/capabilities" },
        {
          label: "Discuss an integration",
          href: "/support?topic=integration-services#support-request",
        },
      ],
    };
  if (/support|help|issue|problem|account|error|not working/i.test(text))
    return {
      sender: "assistant",
      text: "We’re here to help. Find answers in our support centre, or send our team the details of your question using the support form. You can also email this conversation using the link below.",
      links: [
        { label: "Browse support answers", href: "/support#support-answers" },
        { label: "Contact support", href: "/support#support-request" },
      ],
    };
  if (/thank/i.test(text))
    return {
      sender: "assistant",
      text: "You’re welcome. Is there anything else you’d like to explore with Vectramind?",
    };
  return {
    sender: "assistant",
    text: "Our team can help with that. Share your enquiry through our support form, or use “Email our team” below to review and send this conversation. You can also ask me about Synapse, Firstpass or integrations.",
    links: [
      {
        label: "Contact the Vectramind team",
        href: "/support#support-request",
      },
    ],
  };
}
export function ContactDialog() {
  const [messages, setMessages] = useState<Message[]>(welcome);
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const log = conversation.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);
  function send(value: string) {
    const text = value.trim();
    if (!text) return;
    if (!name && (text.length < 2 || text.length > 60)) {
      setMessages((previous) => [
        ...previous,
        {
          sender: "assistant",
          text: "Please enter a name between 2 and 60 characters so we know how to address you.",
        },
      ]);
      return;
    }
    const reply: Message = name
      ? answer(text)
      : {
          sender: "assistant",
          text: `Thanks, ${text}. How can we help you today? Explore our platforms, connect your systems or get support.`,
        };
    if (!name) setName(text);
    setMessages((previous) => [
      ...previous,
      { sender: "visitor", text },
      reply,
    ]);
    setInput("");
    inputRef.current?.focus();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }
  const transcript = messages
    .map(
      (message) =>
        `${message.sender === "visitor" ? "You" : "Vectramind"}: ${message.text}`,
    )
    .join("\n\n");
  const email = `mailto:support@vectramind.com?subject=${encodeURIComponent("Vectramind website enquiry")}&body=${encodeURIComponent(`Name: ${name || "Not provided"}\n\n${transcript}`)}`;
  return (
    <DialogContent
      className="vectramind-chat"
      data-lenis-prevent=""
      onInteractOutside={(event) => event.preventDefault()}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        inputRef.current?.focus();
        if (conversation.current)
          conversation.current.scrollTop = conversation.current.scrollHeight;
      }}
    >
      <div className="chat-header">
        <div>
          <img
            src="/images/vectramind-logo.svg"
            alt="Vectramind"
            width="178"
            height="35"
          />
          <DialogTitle className="chat-title">Help Desk</DialogTitle>
        </div>
      </div>
      <DialogDescription className="sr-only">
        Guided help for Synapse, Firstpass, integrations and contacting the
        Vectramind team.
      </DialogDescription>
      <div className="chat-conversation" ref={conversation}>
        <div
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          aria-relevant="additions text"
          className="chat-messages"
        >
          {messages.map((message, index) => (
            <div
              className={`chat-message chat-message-${message.sender}`}
              key={index}
            >
              {message.sender === "assistant" && (
                <span className="chat-avatar" aria-hidden="true">
                  <img
                    src="/images/vectramind-mark.svg"
                    alt=""
                    width="22"
                    height="22"
                  />
                </span>
              )}
              <div className="chat-bubble">
                <span className="sr-only">
                  {message.sender === "assistant" ? "Vectramind: " : "You: "}
                </span>
                <p>{message.text}</p>
                {message.links && (
                  <div className="chat-message-links">
                    {message.links.map((link) => (
                      <DialogClose asChild key={link.href}>
                        <Link href={link.href}>
                          {link.label}
                          <span aria-hidden="true"> →</span>
                        </Link>
                      </DialogClose>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {name && (
          <div className="chat-topics" aria-label="Suggested topics">
            {topics.map((topic) => (
              <button type="button" key={topic} onClick={() => send(topic)}>
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chat-composer">
        <form onSubmit={submit}>
          <label className="sr-only" htmlFor="vectramind-chat-message">
            {name ? "Your message" : "Your name"}
          </label>
          <input
            ref={inputRef}
            id="vectramind-chat-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={name ? "Type your answer…" : "Your name…"}
            autoComplete={name ? "off" : "given-name"}
            maxLength={name ? 600 : 60}
            enterKeyHint="send"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim()}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <p className="chat-note">
          Guided help. For a personal reply, <a href={email}>email our team.</a>
        </p>
      </div>
    </DialogContent>
  );
}
