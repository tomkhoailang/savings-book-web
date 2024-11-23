"use client"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

import { jwtDecode } from "jwt-decode"
import axios from "axios"
import proxyService from "../../../utils/proxyService"

interface AuthUser {
  username: string
  userId: string
  roles: string[]
  exp: number
}

type AuthContextType = {
  currentUser: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken")
    const storedRefreshToken = localStorage.getItem("refreshToken")

    let user = null
    if (storedAccessToken != null) {
      user = jwtDecode<AuthUser>(storedAccessToken as string)
    }

    if (storedAccessToken) setAccessToken(storedAccessToken)
    if (storedRefreshToken) setRefreshToken(storedRefreshToken)
    if (user) setCurrentUser(user)
    setLoading(false)
  }, [])

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)

    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setCurrentUser(jwtDecode<AuthUser>(accessToken))
  }
  const logout = async () => {

    await proxyService.post("/auth/logout")

    setAccessToken(null)
    setRefreshToken(null)
    setCurrentUser(null)

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("currentUser")
  }
  

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, currentUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
