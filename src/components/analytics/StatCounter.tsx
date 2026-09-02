"use client"

import Script from "next/script"

export function StatCounter() {
  return (
    <>
      <Script
        id="statcounter-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var sc_project=13352945; 
            var sc_invisible=1; 
            var sc_security="59cc8892"; 
          `,
        }}
      />
      <Script
        id="statcounter-script"
        strategy="afterInteractive"
        src="https://www.statcounter.com/counter/counter.js"
      />
      <noscript>
        <div className="statcounter">
          <a
            title="Web Analytics"
            href="https://statcounter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="statcounter"
              src="https://c.statcounter.com/13352945/0/59cc8892/1/"
              alt="Web Analytics"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>
    </>
  )
}
