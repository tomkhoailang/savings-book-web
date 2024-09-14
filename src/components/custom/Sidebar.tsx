"use client"
import { BedSingle, ChevronUp, X } from "lucide-react"

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  Menu,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useRef, useState } from "react"

const LeftSideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const onClickMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div>
      <Menu
        size={40}
        className={`md:hidden h-12 cursor-pointer ${
          isMenuOpen ? "hidden" : ""
        }`}
        onClick={onClickMenu}
      />
      <div
        className={`fixed inset-0  z-50 md:w-48 md:border-r-2 md:shadow-sm transition-transform duration-300 ease-in-out  ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className={`flex flex-col w-full h-full `}>
          <div className="h-24 w-full border-b-2 relative m-0">
            <Image
              src="/images/master_card_1.png"
              alt="master"
              width={1000}
              height={1000}
              className="w-full h-full "
            ></Image>
            <Button
              variant="ghost"
              className="absolute top-0 right-0 text-cyan-950 md:hidden"
              onClick={onClickMenu}
            >
              <X size={24} />
            </Button>
          </div>
          <div className="sidebar-component bg-black  flex flex-col gap-2 grow">
            <div className="parent-group  p-3 border-b-2 ">
              <div className="text-xs mb-2">Dashboard</div>
              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>Trang chủ</div>
              </div>
            </div>
            <div className="parent-group  p-3 border-b-2 space-y-2  ">
              <div className="text-xs mb-2">Sổ tiết kiệm </div>
              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>Mở sổ</div>
              </div>
              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>Lập phiếu gửi tiền</div>
              </div>
              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>Lập phiếu rút tiền</div>
              </div>
            </div>
            <div className="parent-group  p-3 border-b-2 space-y-2  ">
              <div className="text-xs mb-2">Hướng dẫn sử dụng</div>
              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>Bài viết</div>
              </div>
              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>Danh mục</div>
              </div>
            </div>
            <div className="parent-group  p-3 border-b-2 space-y-2 ">
              <div className="text-xs mb-2">Hệ thống</div>

              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>User</div>
              </div>
              <div className="text-sm flex flex-row space-x-2 items-center">
                <BedSingle size={20} className="text-xs" />
                <div>Roles</div>
              </div>
            </div>
          </div>
          <div className="profile-component w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="text-xs flex flex-row space-x-2 items-center p-2 cursor-pointer">
                  <Settings size={16} />
                  <div className="grow">Cài đặt</div>
                  <ChevronUp size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
