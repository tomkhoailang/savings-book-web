"use client"
import { ReactNode, useEffect } from "react"
import { useAuth } from "@/app/contexts/authContext"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const authContext = useAuth()
  const router = useRouter()

  if (authContext?.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!authContext?.currentUser) {
    router.replace("/login")
    return null
  }

  return <>{children}</>
}
