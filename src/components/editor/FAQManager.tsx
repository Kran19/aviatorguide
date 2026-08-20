"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, GripVertical } from "lucide-react"

export interface FAQItem {
  id?: string
  question: string
  answer: string
  sortOrder?: number
}

interface FAQManagerProps {
  faqs: FAQItem[]
  onChange: (faqs: FAQItem[]) => void
}

export function FAQManager({ faqs, onChange }: FAQManagerProps) {
  const addFaq = () => {
    const newFaq: FAQItem = {
      question: "",
      answer: "",
      sortOrder: faqs.length,
    }
    onChange([...faqs, newFaq])
  }

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = faqs.map((faq, i) => {
      if (i === index) {
        return { ...faq, [field]: value }
      }
      return faq
    })
    onChange(updated)
  }

  const deleteFaq = (index: number) => {
    const updated = faqs
      .filter((_, i) => i !== index)
      .map((faq, idx) => ({ ...faq, sortOrder: idx }))
    onChange(updated)
  }

  const moveFaq = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === faqs.length - 1)
    ) {
      return
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1
    const copy = [...faqs]
    const temp = copy[index]
    copy[index] = copy[targetIndex]
    copy[targetIndex] = temp

    // Reassign sort orders
    const updated = copy.map((faq, idx) => ({ ...faq, sortOrder: idx }))
    onChange(updated)
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Frequently Asked Questions (FAQ)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Structured questions &amp; answers rendered in the visible accordion and Google FAQPage Schema.
          </p>
        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {faqs.length} {faqs.length === 1 ? "FAQ" : "FAQs"}
        </span>
      </div>

      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 py-8 text-center bg-muted/20">
          <HelpCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No FAQs added to this post yet.</p>
          <p className="text-xs text-muted-foreground/80 mt-1 mb-4">
            Adding FAQs automatically improves search visibility and generates FAQPage structured data.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add First FAQ</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="relative space-y-3 rounded-lg border border-border/70 bg-background/80 p-4 transition-all hover:border-border shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    FAQ #{index + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    disabled={index === 0}
                    onClick={() => moveFaq(index, "up")}
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    disabled={index === faqs.length - 1}
                    onClick={() => moveFaq(index, "down")}
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteFaq(index)}
                    title="Delete FAQ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Question</label>
                <Input
                  type="text"
                  placeholder="e.g. How does the Aviator cash-out multiplier work?"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  className="bg-card text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Answer</label>
                <Textarea
                  placeholder="Provide a clear, direct answer to the question..."
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  rows={3}
                  className="bg-card text-sm resize-y"
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFaq}
            className="w-full gap-2 border-dashed hover:border-primary/50 hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another FAQ Question</span>
          </Button>
        </div>
      )}
    </div>
  )
}
