"use client"
import moment from "moment"
import { z } from "zod"
import { DataTable } from "@/components/common/datatable"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, List, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// import { CreateUpdateUserModal } from "@/components/pages/saving-book/CreateModal"
import { Metadata } from "@/app/interfaces/metadata"
import { zodResolver } from "@hookform/resolvers/zod"
import Address from "@/app/interfaces/address"
import { DetailUserModal } from "@/components/pages/user-manager/DetailModal"

export interface User extends AuditedEntity {
  id: string
  username: string
  email: string
  CreatorName: string
  lastModifierName: string
  nextSchedule: Date
  isActive: boolean
  isDelete: boolean
}

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lastModifierName",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "creationTime",
    header: "Creation Time",
    cell: ({ row }) => {
      const User = row.original

      return moment(User.creationTime).format("DD/MM/YYYY HH:mm:ss")
    },
  },
  {
    accessorKey: "lastModificationTime",
    cell: ({ row }) => {
      const User = row.original

      if (new Date(User.lastModificationTime).getFullYear() === 1) {
        return ""
      }
      return moment(User.lastModificationTime).format("DD/MM/YYYY HH:mm:ss")
    },
    header: "Last Modification Time",
  },
  {
    accessorKey: "isActive",
    cell: ({ row }) => {
      const User = row.original

      if (User.isActive === true) {
        return "Active"
      }
      return "Block"
    },
    header: "Status",
  },
  {
    id: "disable",
    // cell: ({ row }) => {
    //   return (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" className="h-8 w-8 p-0">
    //           <span className="sr-only">Open menu</span>
    //           <MoreHorizontal className="h-4 w-4" />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //         <DropdownMenuItem>Edit</DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   )
    // },
  },
]

const UserSchema = z.object({
  CreatorName: z.string().min(1, { message: "Name can't be empty." }),
  isActive: z.boolean(),
})

export type UserFormValues = z.infer<typeof UserSchema>
const metadata: Metadata<User, UserFormValues> = {
  getUrl: "/user",
  create: {
    component: (data) => {
      return <DetailUserModal data={data} />
    },
    url: "/user",
  },
  update: {
    component: (data) => {
      return <DetailUserModal data={data} />
    },
    url: "/user",
  },
  formSchema: zodResolver(UserSchema),
  getDefaultValue: (data) => {
    return {
      username: data ? data.username : "",
      email: data ? data.email : "",
      CreatorName: data ? data.CreatorName : "",
      lastModifierName: data ? data.lastModificationTime : "",
      nextSchedule: data ? data.nextSchedule : true,
      isActive: data ? data.isActive : true,
    }
  },
}

const SavingsBookPage = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} metadata={metadata} />
    </div>
  )
}

export default SavingsBookPage
