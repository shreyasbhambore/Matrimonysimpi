import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Heart } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg text-center">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="size-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              We have sent you a confirmation link
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-6">
            <p className="text-muted-foreground">
              Please check your email inbox and click on the confirmation link to verify your account. Once verified, you can complete your profile.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Heart className="size-4 text-primary" />
              <span>Your journey to finding love begins here</span>
            </div>

            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
