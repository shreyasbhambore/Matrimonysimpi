"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ArrowLeft, ArrowRight, Check } from "lucide-react"

const steps = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Location", description: "Where are you from?" },
  { id: 3, title: "Education", description: "Your qualifications" },
  { id: 4, title: "About You", description: "Write your bio" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    dob: "",
    height: "",
    maritalStatus: "",
    religion: "",
    community: "",
    motherTongue: "",
    country: "",
    state: "",
    city: "",
    education: "",
    profession: "",
    income: "",
    bio: "",
  })

  function handleNext() {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Heart className="size-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Help us find your perfect match
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center size-10 rounded-full text-sm font-medium
                ${currentStep > step.id ? "bg-primary text-primary-foreground" : ""}
                ${currentStep === step.id ? "bg-primary text-primary-foreground" : ""}
                ${currentStep < step.id ? "bg-muted text-muted-foreground" : ""}
              `}>
                {currentStep > step.id ? <Check className="size-5" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block w-16 md:w-24 h-1 mx-2 rounded ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Height</label>
                    <Select
                      value={formData.height}
                      onValueChange={(value) => value && setFormData({ ...formData, height: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        {["5'0\"", "5'2\"", "5'4\"", "5'6\"", "5'8\"", "5'10\"", "6'0\"", "6'2\""].map(h => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Marital Status</label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(value) => value && setFormData({ ...formData, maritalStatus: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never_married">Never Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Religion</label>
                    <Select
                      value={formData.religion}
                      onValueChange={(value) => value && setFormData({ ...formData, religion: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="muslim">Muslim</SelectItem>
                        <SelectItem value="christian">Christian</SelectItem>
                        <SelectItem value="sikh">Sikh</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Country</label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => value && setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Education</label>
                  <Select
                    value={formData.education}
                    onValueChange={(value) => value && setFormData({ ...formData, education: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor{"'"}s Degree</SelectItem>
                      <SelectItem value="masters">Master{"'"}s Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profession</label>
                  <Input
                    placeholder="Enter profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Annual Income</label>
                  <Select
                    value={formData.income}
                    onValueChange={(value) => value && setFormData({ ...formData, income: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-5">Below 5 LPA</SelectItem>
                      <SelectItem value="5-10">5-10 LPA</SelectItem>
                      <SelectItem value="10-20">10-20 LPA</SelectItem>
                      <SelectItem value="20-50">20-50 LPA</SelectItem>
                      <SelectItem value="50+">Above 50 LPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">About Me</label>
                  <textarea
                    placeholder="Tell potential matches about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Write about your interests, values, and what you{"'"}re looking for
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length ? "Complete" : "Continue"}
            {currentStep < steps.length && <ArrowRight className="size-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
