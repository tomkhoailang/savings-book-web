"use client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/app/reducers/store"
import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/authContext"

const ToastBar = () => {
  const { toast } = useToast()
  const toastReducer = useSelector((state: RootState) => state.toastReducer)
  const router = useRouter()
  const pathname = usePathname()
  const toastRef: any = useRef(null)
  const authContext = useAuth()

  useEffect(() => {
    if (!toastRef || toastRef.current !== JSON.stringify(toastReducer)) {
      if (toastReducer.isShow) {
        if (toastReducer.title === "Unauthorized") {
          if (pathname !== "/unauthorized") {
            router.push("/unauthorized")
            authContext?.clear()
          }
        } else {
          toast({
            title: toastReducer.title,
            variant: toastReducer.variant,
            description: toastReducer.message,
            duration: 1500,
          })
        }
        toastRef.current = JSON.stringify(toastReducer)
      }
    }
  }, [toastReducer, pathname, authContext])

  return null
}

export default ToastBar
