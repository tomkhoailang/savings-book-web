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
import { CreateSavingBookModal } from "@/components/pages/saving-book/CreateModal"
import { Metadata } from "@/app/interfaces/metadata"
import { zodResolver } from "@hookform/resolvers/zod"
import Address from "@/app/interfaces/address"
import { DetailSavingBookModal } from "@/components/pages/saving-book/DetailModal"

export interface Regulation extends AuditedEntity {
  regulationIdRef: string
  applyDate: Date
  name: string
  termInMonth: number
  interestRate: number
  minWithDrawValue: number
  minWithDrawDay: number
  noTermInterestRate: number
}

export interface SavingBook extends AuditedEntity {
  accountId: string
  regulations: Regulation[]
  address: Address
  idCardNumber: string
  balance: number
  nextSchedule: Date
  isActive: boolean
  newPaymentAmount: number
  term: number
}

const columns: ColumnDef<SavingBook>[] = [
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
    accessorKey: "idCardNumber",
    header: "ID Card Number",
  },
  {
    header: "Address",
    cell: ({ row }) => {
      const savingBook = row.original

      return (
        <div>
          {savingBook.address.street}
          {", "}
          {savingBook.address.city}
          {", "}
          {savingBook.address.country}
        </div>
      )
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
  {
    accessorKey: "creationTime",
    header: "Creation Time",
    cell: ({ row }) => {
      const savingBook = row.original

      return moment(savingBook.creationTime).format("DD/MM/YYYY HH:mm:ss")
    },
  },
  {
    accessorKey: "lastModificationTime",
    cell: ({ row }) => {
      const savingBook = row.original

      if (new Date(savingBook.lastModificationTime).getFullYear() === 1) {
        return ""
      }
      return moment(savingBook.lastModificationTime).format(
        "DD/MM/YYYY HH:mm:ss"
      )
    },
    header: "Last Modification Time",
  },
  {
    accessorKey: "term",
    cell: ({ row }) => {
      const savingBook = row.original

      const term = savingBook.regulations.at(
        savingBook.regulations.length - 1
      )?.termInMonth
      return term === 0 ? "Zero" : term
    },
    header: "Term",
  },
  {
    accessorKey: "interestRate",
    cell: ({ row }) => {
      const savingBook = row.original

      return (
        savingBook.regulations.at(savingBook.regulations.length - 1)
          ?.interestRate + "%"
      )
    },
    header: "Interest Rate",
  },
  {
    id: "actions",
  },
]
const AddressSchema = z.object({
  street: z.string().min(1, { message: "Street can't be empty." }),
  city: z.string().min(1, { message: "City can't be empty." }),
  country: z.string().min(1, { message: "Country can't be empty." }),
})

const SavingBookSchema = z.object({
  address: AddressSchema,
  idCardNumber: z
    .string()
    .min(9, { message: "ID card number must be at least 9 characters" })
    .max(12, {
      message: "ID card number must be less or equal than 12 characters",
    }),
  balance: z.number().min(1, { message: "Balance can't be empty." }),
  // regulations: z,
  isActive: z.boolean(),
  term: z.number(),
  newPaymentAmount: z.number().min(1, { message: "Balance can't be empty." }),
})

export type SavingBookFormValues = z.infer<typeof SavingBookSchema>
export type AddressFormValues = z.infer<typeof AddressSchema>
const metadata: Metadata<SavingBook, SavingBookFormValues> = {
  getUrl: "/saving-book",
  create: {
    component: (data) => {
      return <DetailSavingBookModal data={data} />
    },
    url: "/saving-book",
  },
  update: {
    component: (data) => {
      return <DetailSavingBookModal data={data} />
    },
    url: "/saving-book",
  },
  formSchema: zodResolver(SavingBookSchema),
  getDefaultValue: (data) => {
    return {
      regulations: data ? data.regulations[data.regulations.length - 1] : [],
      address: data
        ? data.address
        : { street: "", city: "", country: "", zipCode: "", state: "" },
      idCardNumber: data ? data.idCardNumber : "",
      balance: data ? data.balance : 0,
      nextSchedule: data ? data.nextSchedule : true,
      isActive: data ? data.isActive : true,
      term: 0,
      newPaymentAmount: 0,
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
