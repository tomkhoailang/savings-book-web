"use client"
import moment from "moment"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, List, MoreHorizontal, SplitSquareVertical } from "lucide-react"
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
import { CreateUpdateRegulationModal } from "@/components/pages/regulations/CreateUpdateRegulationModal"
import { Metadata } from "@/app/interfaces/metadata"
import { zodResolver } from "@hookform/resolvers/zod"
import { DataTable } from "@/components/common/datatable/Datatable"
import Address, { ZodAddress } from "@/app/interfaces/common/address"
import { CreateUpdateSavingBookModal } from "@/components/pages/savings-book/CreateUpdateSavingBookModal"

export interface BookRegulation {
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
  regulations: BookRegulation[]
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
    header: "Address",
    cell: ({ row }) => {
      const savingBook = row.original
      return `${savingBook.address.street ?? ""}, ${savingBook.address.city ?? ""}, ${savingBook.address.country ?? ""}`
    },
  },
  {
    accessorKey: "minWithdrawValue",
    header: "Min Withdraw Value",
  },
  {
    cell: ({ row }) => {
      const savingBook = row.original
      if (savingBook.isActive) {
        return <Check className="text-green-400 w-full" />
      }
    },
    header: "Active",
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
  }
]

const SavingBookSchema = z.object({
  address: ZodAddress,
  idCardNumber: z.string().min(9, {message: "Id card number must be at least 9 character"}).max(12, {message: "Id card number cannot exceeds 12 characters"}),
  term: z.number(),
  newPaymentAmount: z.number(),
})

export type SavingBookFormValues = z.infer<typeof SavingBookSchema>

const metadata: Metadata<SavingBook, SavingBookFormValues> = {
  getUrl: "/saving-book",
  deleteUrl: "",
  selectMultipleRow: true,
  create: {
    component: (data) => {
      return <CreateUpdateSavingBookModal data={data} />
    },
    url: "/saving-book",
  },
  formSchema: zodResolver(SavingBookSchema),
  getDefaultValue: (data) => {
    return {
      idCardNumber: data ? data.idCardNumber : "",
      term: data ? data.term : 0,
      newPaymentAmount: data ? data.newPaymentAmount : 10,
      address: data
        ? data.address
        : {
            country: "",
            city: "",
            street: "",
            zipCode: "",
          },
    }
  },
}

const SavingBookPage = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} metadata={metadata} />
    </div>
  )
}

export default SavingBookPage
