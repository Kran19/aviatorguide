export const metadata = {
  title: 'Privacy Policy | betsetgo.xyz',
  description: 'Privacy Policy and Terms for betsetgo.xyz',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            Welcome to betsetgo.xyz. We respect your privacy and are committed to protecting your personal data. 
            When you visit our website, we may collect basic analytics data, including but not limited to your IP address, 
            browser type, and pages visited, to help us improve our services.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our content</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
          </ul>

          <h2>3. Cookies</h2>
          <p>
            Like any other website, betsetgo.xyz uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2>4. Third-Party Privacy Policies</h2>
          <p>
            betsetgo.xyz's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
        </div>
      </div>
    </div>
  )
}
