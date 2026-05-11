import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const stories = [
  {
    names: "Priya & Rahul",
    location: "Mumbai",
    text: "We found each other through Namdevsimpi Matrimony and knew instantly that we were meant to be. Thank you for helping us find our happily ever after!",
  },
  {
    names: "Ananya & Vikram",
    location: "Bangalore",
    text: "Namdevsimpi Matrimony made it so easy for our families to connect. We are grateful for the trust and transparency throughout our journey.",
  },
  {
    names: "Meera & Arjun",
    location: "Delhi",
    text: "What started as a simple profile view turned into the most beautiful relationship. We are getting married next month!",
  },
]

export function SuccessStories() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Success Stories</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Real couples who found their perfect match through Namdevsimpi Matrimony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stories.map((story) => (
            <Card key={story.names} className="relative overflow-hidden">
              <CardContent className="p-6">
                <Quote className="size-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {`"${story.text}"`}
                </p>
                <div>
                  <p className="font-serif font-semibold">{story.names}</p>
                  <p className="text-sm text-muted-foreground">{story.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
