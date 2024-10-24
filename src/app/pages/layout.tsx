"use client"
import ProtectedRoute from "@/components/auth/protectedRoute"
import BreadCumb from "@/components/common/BreadCumb"
import SideBarLayout from "@/components/layout/SideBarLayout"
import { Provider } from "react-redux"
import store from "../reducers/store"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Provider store={store}>
      <ProtectedRoute>
        <div className="min-h-screen flex ">
          <div className="w-48 flex-shrink-0">
            <SideBarLayout />
          </div>
          <div className="flex-grow ">
            <BreadCumb />
            <div className=" m-2">{children}</div>
          </div>
        </div>
      </ProtectedRoute>
    </Provider>
  )
}
