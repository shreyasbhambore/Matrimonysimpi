import { ProfileView } from "@/components/profile-view"

export const metadata = {
  title: "Profile | Matrimony",
  description: "View profile",
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = require("use-async").use(params)
  return <ProfileView userId={id} />
}
