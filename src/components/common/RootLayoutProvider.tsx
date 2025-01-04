"use client"

import { Provider } from "react-redux"
import { ThemeProvider } from "@/components/common/theme-provider"
import ToastBar from "@/components/common/ToastBar"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/app/contexts/authContext"
import { initializeStore } from "@/app/reducers/store"
import LoadingOverlay from "./LoadingOverlay"
import NotificationProvier from "@/app/contexts/notificationContext"

export default function RootLayoutProviders({ children }: { children: React.ReactNode }) {
  const store = initializeStore()

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <NotificationProvier>{children}</NotificationProvier>
          <LoadingOverlay />
          <ToastBar />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
}
