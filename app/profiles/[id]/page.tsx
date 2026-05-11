import { ProfileView } from "@/components/profile-view"

export const metadata = {
  title: "Profile | Namdevsimpi Matrimony",
  description: "View profile on Namdevsimpi Matrimony - Find your perfect life partner",
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = require("use-async").use(params)
  return <ProfileView userId={id} />
}
