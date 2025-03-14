import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn't exist or you don't have permission to access it.
        </p>
        <Button asChild className="bg-purple-700 hover:bg-purple-600">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

