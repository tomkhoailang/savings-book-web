"use client"
import { ReactNode, useEffect } from "react"
import { useAuth } from "@/app/contexts/authContext"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const authContext = useAuth()
  const router = useRouter()

  if (!authContext?.currentUser) {
    router.replace("/login")
    return null
  }

  return <>{children}</>
}
