"use client"

import React, { useState } from "react"
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  faqs: FaqItem[]
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]) // First FAQ open by default

  if (!faqs || faqs.length === 0) return null

  const toggleFaq = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <section id="faq-section" className="w-full max-w-4xl mx-auto my-12 pt-8 border-t border-border/50">
      {/* Section Heading */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Section</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Find answers to common questions about gameplay, rules, strategies, and fairness.
        </p>
      </div>

      {/* Accordion Cards List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index)
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-slate-900/90 dark:bg-slate-900/90 border-primary/40 shadow-lg shadow-primary/5"
                  : "bg-background/50 border-border/60 hover:border-border"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 group focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${isOpen ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                    isOpen
                      ? "bg-primary/20 border-primary/40 text-primary rotate-180"
                      : "bg-muted/40 border-border text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Expandable Answer */}
              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-muted-foreground text-base leading-relaxed border-t border-border/30 mt-1 pl-11">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
