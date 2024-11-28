"use clinet"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoadingButtonProps {
  isLoading: boolean
  label: string
  loadingText?: string
  onclick?: any
}

export default function LoadingButton({
  isLoading,
  label,
  loadingText = "Please wait",
  onclick
}: LoadingButtonProps) {
  return (
    <Button type="submit" className="mt-2" disabled={isLoading} onClick={(e) => {
      if (typeof onclick === "function") {
        onclick()
      }
    }}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        label
      )}
    </Button>
  )
}
