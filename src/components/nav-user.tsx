"use client"

import { BadgeCheck, Bell, LogOut, Pen, Sparkles } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CaretSortIcon, ComponentPlaceholderIcon } from "@radix-ui/react-icons"
import { AuthUser, useAuth } from "@/app/contexts/authContext"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { SocketHelper } from "../../utils/socketHelper"
import { setData } from "@/app/reducers/socketReducer"
import { useRouter } from "next/navigation"
import { Dialog } from "@radix-ui/react-dialog"
import ChangePassword from "./pages/user/ChangePasswordModal"
import { CreateUpdateRegulationModal } from "./pages/regulations/CreateUpdateRegulationModal"

export function NavUser({ user }: { user: any }) {
  const { isMobile } = useSidebar()
  const authContext = useAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== undefined) {
      const token = localStorage.getItem("accessToken")

      if (token) {
        SocketHelper.connect(
          token,
          SocketHelper.listenEvent((res: any) => {
            dispatch(setData(res))
          })
        )
      }
    }
    return () => {
      SocketHelper.disconnect()
    }
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.username}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.username}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ChangePassword />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                authContext?.logout()
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
