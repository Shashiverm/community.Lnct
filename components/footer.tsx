import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-lnct-blue">LNCT</span>
              <span className="text-lg font-medium">Community</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting students, alumni, and faculty of Lakshmi Narain College of Technology.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources/academic" className="text-muted-foreground hover:text-foreground">
                  Academic Resources
                </Link>
              </li>
              <li>
                <Link href="/resources/career" className="text-muted-foreground hover:text-foreground">
                  Career Development
                </Link>
              </li>
              <li>
                <Link href="/resources/technical" className="text-muted-foreground hover:text-foreground">
                  Technical Materials
                </Link>
              </li>
              <li>
                <Link href="/resources/library" className="text-muted-foreground hover:text-foreground">
                  Digital Library
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="text-muted-foreground hover:text-foreground">
                  Alumni Directory
                </Link>
              </li>
              <li>
              <Link href="/network" className="text-muted-foreground hover:text-foreground">
                  Network
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
                  Job Board
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LNCT Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

