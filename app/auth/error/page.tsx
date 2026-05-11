import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg text-center">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="size-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif">Authentication Error</CardTitle>
            <CardDescription className="text-base">
              Something went wrong during authentication
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-6">
            <p className="text-muted-foreground">
              We could not complete the authentication process. This could be due to an expired link or a technical issue.
            </p>

            <div className="flex flex-col gap-3 pt-4">
              <Link href="/login">
                <Button className="w-full">Try Again</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
