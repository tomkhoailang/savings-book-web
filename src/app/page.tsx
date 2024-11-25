"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { close, open } from "./reducers/loadingReducer"

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      dispatch(open())
      router.push("/login")
    }
    return () => {
      dispatch(close())
    }
  }, [])

  return (
    <></>
  )
}
