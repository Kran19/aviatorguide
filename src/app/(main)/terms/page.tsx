import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - I Sports Game Guide",
  description: "Terms of Service for I Sports Game Guide (aviatorgameguide.com).",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-24">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <div className="glass-card rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-background/60 p-8 md:p-12 lg:p-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground max-w-none prose-a:text-primary hover:prose-a:text-primary/80">
            <p>Last updated: July 15, 2026</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using I Sports Game Guide at aviatorgameguide.com ("the Website"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Website.
            </p>

            <h2>2. User Content</h2>
            <p>
              When interacting with the Website (e.g., commenting on blog posts), you agree not to post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, or otherwise objectionable. We reserve the right to remove any content that violates these guidelines.
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              All content on the Website, including text, graphics, logos, images, and software, is the property of I Sports Game Guide or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from this content without express written permission.
            </p>

            <h2>4. Third-Party Links</h2>
            <p>
              The Website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these websites. We encourage you to read the terms and conditions and privacy policies of any third-party websites you visit.
            </p>

            <h2>5. Disclaimer of Warranties</h2>
            <p>
              The information provided on the Website is for general informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the Website or the information contained on the Website.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall I Sports Game Guide, its authors, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Website.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the updated Terms on the Website. Your continued use of the Website after such modifications constitutes your acceptance of the new terms.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us via our Contact Page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
