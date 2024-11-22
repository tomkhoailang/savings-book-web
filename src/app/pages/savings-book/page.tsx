"use client"
import moment from "moment"
import { z } from "zod"
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
    accessorKey: "minWithdrawDay",
    header: "Min Withdraw Day",
  },
  {
    accessorKey: "minWithdrawValue",
    header: "Min Withdraw Value",
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
    accessorKey: "lastModificationTime",
    cell: ({ row }) => {
      const regulation = row.original

      if (new Date(regulation.lastModificationTime).getFullYear() === 1) {
        return ""
      }
      return moment(regulation.lastModificationTime).format(
        "DD/MM/YYYY HH:mm:ss"
      )
    },
    header: "Last Modification Time",
  }
]

const SavingBookSchema = z.object({
  address: ZodAddress,
  idCardNumber: z.string(),
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
