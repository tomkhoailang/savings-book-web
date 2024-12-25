"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useAuth } from "@/app/contexts/authContext"
import { useRouter } from "next/navigation"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "dashboard",
      icon: Frame,
    },
  ],
  navMain: [
    {
      title: "Saving Book",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Details",
          url: "savings-book",
        },
        {
          title: "Regulation",
          url: "regulations",
        },
        {
          title: "Transaction Tickets",
          url: "transaction-tickets",
        },
        {
          title: "Monthly Interests",
          url: "monthly-interests",
        },
      ],
    },
    {
      title: "System",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "User",
          url: "user-manager/users",
        },
      ],
    },
  ],
}

const dataUser = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Saving Book",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Details",
          url: "savings-book",
        },
        {
          title: "Transaction Tickets",
          url: "transaction-tickets",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authContext = useAuth()
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    if (authContext?.currentUser != null) {
      data.user.name = authContext.currentUser.username.toString()
      console.log(authContext)
    }

    if (authContext?.currentUser?.roles.includes("Admin")) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [authContext])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        {isAdmin === true ? (
          <div>
            <NavProjects projects={data.projects} />
            <NavMain items={data.navMain} />
          </div>
        ) : (
          <div>
            <NavMain items={dataUser.navMain} />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={authContext?.currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
