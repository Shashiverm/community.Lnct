import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, FileText, ThumbsUp } from "lucide-react"
import Link from "next/link"

export function ResourcesPreview() {
  const resources = [
    {
      id: "1",
      title: "Complete Data Structures & Algorithms Guide",
      description: "A comprehensive guide to data structures and algorithms for computer science students.",
      category: "Academic",
      type: "PDF",
      downloads: 1250,
      likes: 320,
      author: "Prof. Sharma",
    },
    {
      id: "2",
      title: "Resume Building Workshop Materials",
      description: "Templates and guides for creating an effective resume for tech industry jobs.",
      category: "Career",
      type: "Document",
      downloads: 850,
      likes: 210,
      author: "Career Cell",
    },
    {
      id: "3",
      title: "Machine Learning Project Examples",
      description: "Collection of machine learning projects with source code and documentation.",
      category: "Technical",
      type: "Repository",
      downloads: 720,
      likes: 180,
      author: "AI Club",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Popular Resources</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Access educational materials, career resources, and technical guides shared by the community.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex flex-col overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{resource.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-1 h-4 w-4" />
                    {resource.type}
                  </div>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-muted-foreground">Shared by {resource.author}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Download className="mr-1 h-4 w-4" />
                    {resource.downloads}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {resource.likes}
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/resources/${resource.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/resources">Browse All Resources</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
