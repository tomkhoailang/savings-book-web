"use client"
import { AppSidebar } from "@/components/app-sidebar"
import Notification from "@/components/common/Notification"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Children } from "react"
import { usePathname } from "next/navigation"
import * as React from "react"
import { object } from "zod"
import Page from "../dashboard/page"
import path from "path"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const [routeName, setRouteName] = React.useState({ page: "", page1: "" })
  React.useEffect(() => {
    console.log("sdfsadf", pathname)
    switch (pathname) {
      case "/pages/savings-book":
        setRouteName({ page: "Saving Books", page1: "Details" })
        break
      case "/pages/regulations":
        setRouteName({ page: "Saving Books", page1: "Regulations" })
        break
      case "/pages/transaction-tickets":
        setRouteName({ page: "Saving Books", page1: "Transaction Tickets" })
        break
      case "/pages/monthly-interests":
        setRouteName({ page: "Saving Books", page1: "Monthly Interests" })
        break
      case "/pages/user-manager/users":
        setRouteName({ page: "System", page1: "Users" })
        break
      case "/pages/dashboard":
        setRouteName({ page: "Dashboard", page1: "" })
        break
    }
  }, [pathname])
  // Generate breadcrumb items dynamically based on the path
  const pathSegments = pathname?.split("/").filter(Boolean) || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex-grow flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{routeName?.page}</BreadcrumbLink>
                </BreadcrumbItem>
                {routeName?.page1 && (
                  <BreadcrumbPage>{" > " + routeName?.page1}</BreadcrumbPage>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mr-4 flex flex-row space-x-2 items-center justify-center">
            <div className="mr-2">
              <ThemeToggle />
            </div>
            <Notification />
          </div>
        </header>
        <main className="mx-2 mb-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
