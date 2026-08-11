"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QUESTIONS = [
  {
    question: "Do I need an account?",
    answer:
      "Yes, but there's nothing to fill out. Sign in with Google or GitHub and you're in — no forms, no email verification. Prefer to look around first? Use the demo account from the login page; it comes preloaded with sample data.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Every application is scoped to your account, so signing in with a new Google or GitHub account starts you with a completely empty tracker — nobody else's data, and nobody sees yours.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "In a Cloud PostgreSQL database. You can export everything as CSV or JSON at any time from Settings — CSV for a spreadsheet, JSON if you want every field exactly as stored.",
  },
  {
    question: "What counts as an 'interview rate'?",
    answer:
      "The share of your applications that reached at least one assessment or interview stage — measured from status history, not the current status. An application that was rejected after a technical round still counts as having reached an interview.",
  },
  {
    question: "Does it track every status change?",
    answer:
      "Every one. Each application keeps an append-only timeline of its transitions with timestamps, so you can see exactly how long a company sat on your application before moving.",
  },
  {
    question: "Is there a mobile version?",
    answer:
      "The same app. On phones the sidebar becomes a bottom tab bar, tables become cards, and filters open in a drawer. Everything is reachable with one thumb.",
  },
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {QUESTIONS.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-[0.9375rem] font-medium hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
