export const metadata = {
  title: 'Disclaimer | I Sports Game Guide',
  description: 'Read our Disclaimer covering age restrictions, jurisdiction limitations, and informational nature of content on I Sports Game Guide.',
  robots: 'index, follow',
  alternates: {
    canonical: '/disclaimer',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Disclaimer</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. General Information</h2>
          <p>
            The content published on this blog (aviatorgameguide.com) is provided for general informational and entertainment purposes only. It relates to online gaming topics, including game guides, crash game mechanics, esports reviews, and industry-related content.
          </p>
          <p>
            Nothing on this website should be interpreted as professional, financial, legal, or gambling advice. Any reliance you place on the information provided is strictly at your own discretion and risk.
          </p>

          <h2>2. No Guarantee of Outcomes</h2>
          <p>
            Content on this blog, including but not limited to game guides, strategy articles, and reviews, is intended to help readers understand how certain games work and how platforms operate. This content does not, and cannot, guarantee any winnings, outcomes, or financial results.
          </p>
          <p>
            Online gaming and real-money games involve an element of chance and financial risk. Past performance, strategies, or patterns discussed on this blog do not guarantee future results. We do not assume responsibility for any losses incurred as a result of decisions made based on our content.
          </p>

          <h2>3. Age Restriction</h2>
          <p>
            This website and its content are intended strictly for individuals who are 18 years of age or older (or the legal age for gambling/gaming in their respective jurisdiction, whichever is higher). By accessing this website, you confirm that you meet this age requirement.
          </p>
          <p>
            If you are underage, please exit this website immediately.
          </p>

          <h2>4. Jurisdictional Restrictions</h2>
          <p>
            Our content, platform, and services are not intended for, or directed at, users located in India, in accordance with applicable Indian gaming regulations, including the Promotion and Regulation of Online Gaming Act 2025 and associated Rules.
          </p>
          <p>
            It is the visitor's responsibility to ensure that accessing real-money gaming platforms and related content is legal in their jurisdiction. We do not accept liability for use of this website or any linked platform by individuals in restricted or prohibited territories.
          </p>

          <h2>5. Responsible Gambling Notice</h2>
          <p>
            Gambling can be addictive. Please play responsibly. If you or someone you know is struggling with gambling-related harm, please seek help from appropriate support organizations in your region.
          </p>
          <p>
            Take time to think. Set limits before you play, and never gamble more than you can afford to lose.
          </p>

          <h2>6. Relationship to Our Platform</h2>
          <p>
            This blog is operated by the same company that operates the "rocky11". Links from this blog to the Platform direct users to our own product and are not third-party affiliate or commission-based links.
          </p>
          <p>
            While we naturally aim to inform readers about our Platform's offerings, our editorial content strives to remain accurate, balanced, and useful, rather than purely promotional.
          </p>

          <h2>7. Accuracy of Information</h2>
          <p>
            We make reasonable efforts to keep our content accurate and up to date. However, game rules, odds, platform features, bonus terms, and regulations can change over time. We do not guarantee that all information on this website is complete, current, or error-free.
          </p>
          <p>
            Before relying on any specific detail (such as game rules, bonus terms, or payment methods), please verify directly on the Platform itself, as blog content may not always reflect real-time updates.
          </p>

          <h2>8. Third-Party Content and Links</h2>
          <p>
            This blog may reference or link to third-party game providers, platforms, or external resources for informational purposes. We do not control, endorse, or take responsibility for the content, accuracy, or practices of these third parties.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, I Sports Game Guide and its affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website, reliance on its content, or use of any linked platform.
          </p>

          <h2>10. Changes to This Disclaimer</h2>
          <p>
            We may update this Disclaimer from time to time to reflect changes in our content, services, or applicable regulations. The "Last Updated" date at the top of this page reflects the most recent revision.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Disclaimer, please contact us at:
          </p>
          <ul>
            <li><strong>Website:</strong> aviatorgameguide.com</li>
            <li><strong>Email:</strong> support@aviatorgameguide.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
