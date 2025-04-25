import { auth } from "@/auth.config"

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user) return null
  
  return {
    id: session.user.id,
    name: session.user.name || "Anonymous",
    email: session.user.email,
    avatar: session.user.image,
    initials: session.user.name?.substring(0, 2).toUpperCase() || "AN"
  }
} 