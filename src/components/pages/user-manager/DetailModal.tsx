"use client"
import { User, UserFormValues } from "@/app/pages/user-manager/users/page"
import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Controller, useForm, useFormContext } from "react-hook-form"
import TextInput from "../../common/InputText"
import { Checkbox } from "../../ui/checkbox"
import { CircleMinus, MoreHorizontal, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import proxyService from "@/app/services/proxyService"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownItem } from "@nextui-org/react"
import Address from "@/app/interfaces/address"
import moment from "moment"

export function DetailUserModal({ data }: { data: User | null }) {
  const userForm = useFormContext<UserFormValues>()

  const [isOpen, setIsOpen] = useState(false)

  const status = data?.isActive ? "Active" : "Block"

  useEffect(() => {
    userForm.reset()
  }, [isOpen])

  return (
    <>
      <div className="flex flex-row justify-between space-x-5">
        <TextInput
          control={userForm.control}
          name="username"
          label="Username"
          placeholder="Username"
          className=" w-1/2"
        />
        <TextInput
          control={userForm.control}
          name="email"
          label="Email"
          placeholder="Email"
          className=" w-1/2"
        />
      </div>
      <div className="flex flex-row justify-between space-x-5">
        <TextInput
          control={userForm.control}
          name="CreatorName"
          label="Name"
          placeholder="Name"
          className=" w-1/2"
        />
        <TextInput
          control={userForm.control}
          name="isActive"
          label="Status"
          placeholder="Status"
          defaultValue={status}
          className=" w-1/2"
        />
      </div>
      {data?.creationTime && (
        <div className="flex flex-row justify-between space-x-5">
          <TextInput
            control={userForm.control}
            name="creationTime"
            label="Creation Time"
            placeholder="Creation Time"
            defaultValue={moment(data.creationTime).format(
              "DD/MM/YYYY HH:mm:ss"
            )}
            className=" w-1/2"
          />
          <TextInput
            control={userForm.control}
            name="lastModificationTime"
            label="Last Modification Time"
            placeholder="Last Modification Time"
            defaultValue={moment(data.lastModificationTime).format(
              "DD/MM/YYYY HH:mm:ss"
            )}
            className=" w-1/2"
          />
        </div>
      )}
    </>
  )
}
