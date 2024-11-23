import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/common/theme-provider"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "./contexts/authContext"
import ToastBar from "@/components/common/ToastBar"
import { initializeStore } from "./reducers/store"
import { Provider } from "react-redux"
import RootLayoutProviders from "@/components/common/RootLayoutProvider"

const inter = Inter({ subsets: ["vietnamese"], weight: ["100", "300"] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const store = initializeStore()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutProviders>{children}</RootLayoutProviders>
      </body>
    </html>
  )
}
