"use client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/app/reducers/store"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const ToastBar = () => {
  const { toast } = useToast()
  const toastReducer = useSelector((state: RootState) => state.toastReducer)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (toastReducer.isShow) {
      if (toastReducer.title === "Unauthorized") {
        if (pathname !== "/unauthorized") {
          router.push("/unauthorized")
        }
      } else {
        toast({
          title: toastReducer.title,
          variant: toastReducer.variant,
          description: toastReducer.message,
          duration: 1500,
        })
      }
    }
  }, [toastReducer, pathname])

  return null
}

export default ToastBar
