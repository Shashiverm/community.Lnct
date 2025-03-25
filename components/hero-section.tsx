import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Welcome to the LNCT Community
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Connect with students, alumni, and faculty of Lakshmi Narain College of Technology. Share resources,
                discover events, and build your professional network.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Join the Community</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-lnct-blue to-blue-600 opacity-90"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="mb-4 rounded-full bg-white/10 p-3">
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold">Connect with 10,000+ LNCT Members</h3>
                <p className="mb-4 max-w-[300px] text-white/90">
                  Join a thriving community of students, alumni, and faculty members.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="rounded-lg bg-white/10 p-3">
                    <div className="font-bold">500+</div>
                    <div className="text-sm text-white/70">Events per year</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <div className="font-bold">2,000+</div>
                    <div className="text-sm text-white/70">Resources shared</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <div className="font-bold">300+</div>
                    <div className="text-sm text-white/70">Job opportunities</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <div className="font-bold">5,000+</div>
                    <div className="text-sm text-white/70">Alumni connections</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

