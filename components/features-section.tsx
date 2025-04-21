import { BookOpen, Calendar, Network, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-lnct-blue px-3 py-1 text-sm text-white">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to connect and grow
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our platform provides all the tools you need to connect with the LNCT community, share resources, and
              advance your career.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-lnct-blue p-3 text-white">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Networking</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Connect with students, alumni, and faculty members to build your professional network.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-lnct-blue p-3 text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Events</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Discover and participate in academic, cultural, and professional events.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-lnct-blue p-3 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Resources</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Access and share educational resources, study materials, and career guidance.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-lnct-blue p-3 text-white">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Job Board</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Find internships, job opportunities, and career advancement resources from alumni and partners.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
