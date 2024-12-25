"use client"
import moment from "moment"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, List, MoreHorizontal, Shield, ShieldBan } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CreateUpdateRegulationModal } from "@/components/pages/regulations/CreateUpdateRegulationModal"
import { Metadata } from "@/app/interfaces/metadata"
import { zodResolver } from "@hookform/resolvers/zod"
import { DataTable } from "@/components/common/datatable/Datatable"
import { Fragment, useState } from "react"
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@radix-ui/react-alert-dialog"
import { table } from "console"
import LoadingButton from "@/components/common/LoadingButton"
import { DialogHeader, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { FormProvider } from "react-hook-form"
import ConfirmBanModal from "@/components/pages/user/ConfirmBanModal"
import { useAuth } from "@/app/contexts/authContext"

export interface User extends AuditedEntity {
  username: string
  email: string
}

const UserSchema = z.object({})

export type UserFormValues = z.infer<typeof UserSchema>

const metadata: Metadata<User, UserFormValues> = {
  getUrl: "/user",
  selectMultipleRow: true,
}

const UserPage = () => {
  const authContext = useAuth()

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      cell: ({ row }) => {
        const regulation = row.original
        if (regulation.isActive) {
          return <Check className="text-green-400 w-full" />
        }
      },
      header: "Active",
    },
    {
      accessorKey: "creationTime",
      header: "Creation Time",
      cell: ({ row }) => {
        const regulation = row.original

        return moment(regulation.creationTime).format("DD/MM/YYYY HH:mm:ss")
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center ">
            <ConfirmBanModal user={row.original} />
          </div>
        )
      },
    },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Fragment>
      <DataTable columns={columns} metadata={metadata} />
    </Fragment>
  )
}

export default UserPage
