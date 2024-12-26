"use client"
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"

import { jwtDecode } from "jwt-decode"
import axios from "axios"
import proxyService from "../../../utils/proxyService"
import { useRouter } from "next/navigation"

type NotificationContextType = {
  openNotification: boolean
  setOpenNotification: any
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export default function NotificationProvier({ children }: { children: ReactNode }) {
  const [openNotification, setOpenNotification] = useState(false)


  return (
    <NotificationContext.Provider
      value={{ openNotification, setOpenNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  return context
}
