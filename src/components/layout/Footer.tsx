import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-bold">betsetgo.xyz</span>. The source code is available on{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
          <Link href="/terms" className="hover:underline underline-offset-4">Terms</Link>
          <Link href="/contact" className="hover:underline underline-offset-4">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
