"use client"

import React, { useState, useTransition } from "react"
import { submitContactMessage } from "@/app/actions/contact"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      const data = new FormData()
      data.set("name", formData.name)
      data.set("email", formData.email)
      data.set("subject", formData.subject)
      data.set("message", formData.message)

      const res = await submitContactMessage(data)
      if (res.success) {
        toast.success("Message sent successfully! We will get back to you soon.")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        toast.error(res.error || "Failed to send message.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* 3D ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/20 blur-[150px] rounded-full -z-10" />

      <div className="container mx-auto max-w-4xl px-4 py-24 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question, partnership inquiry, or just want to say hi? Drop us a line below.
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-background/60 p-8 md:p-12 mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground/80 font-medium">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="bg-background/40 border-white/10 focus-visible:ring-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="bg-background/40 border-white/10 focus-visible:ring-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground/80 font-medium">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
                className="bg-background/40 border-white/10 focus-visible:ring-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground/80 font-medium">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
                rows={6}
                className="bg-background/40 border-white/10 focus-visible:ring-primary/50 transition-colors resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
