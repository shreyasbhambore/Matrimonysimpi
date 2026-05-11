export interface Profile {
  id: string
  user_id: string
  full_name: string
  gender: "male" | "female"
  date_of_birth: string
  age?: number
  height?: string
  weight?: string
  marital_status?: string
  religion?: string
  community?: string
  mother_tongue?: string
  country?: string
  state?: string
  city?: string
  education?: string
  profession?: string
  company?: string
  income?: string
  bio?: string
  profile_photo?: string
  photos?: string[]
  onboarding_completed: boolean
  profile_completion: number
  verification_status: "pending" | "verified" | "rejected"
  created_at: string
  updated_at: string
}

export interface PartnerPreferences {
  id: string
  user_id: string
  age_min?: number
  age_max?: number
  height_min?: string
  height_max?: string
  religion?: string[]
  community?: string[]
  education?: string[]
  profession?: string[]
  city?: string[]
  income_min?: string
  created_at: string
  updated_at: string
}

export interface Interest {
  id: string
  from_user_id: string
  to_user_id: string
  status: "pending" | "accepted" | "rejected"
  created_at: string
}
