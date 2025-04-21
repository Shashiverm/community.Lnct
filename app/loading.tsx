export default function Loading() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare your content</p>
      </div>
    </div>
  )
}
