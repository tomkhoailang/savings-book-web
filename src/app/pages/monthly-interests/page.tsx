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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CreateUpdateRegulationModal } from "@/components/pages/regulations/CreateUpdateRegulationModal"
import { Metadata } from "@/app/interfaces/metadata"
import { zodResolver } from "@hookform/resolvers/zod"
import { DataTable } from "@/components/common/datatable/Datatable"

export interface MonthlyInterestOutput extends AuditedEntity {
  savingBookId: string
  amount: number
  interestRate: number
}

const columns: ColumnDef<MonthlyInterestOutput>[] = [
  {
    accessorKey: "savingBookId",
    header: "Saving Book",
  },
  {
    accessorKey: "interestRate",
    header: "InterestRate",
  },
  {
    accessorKey: "amount",
    header: "Increase amount",
  },
  {
    accessorKey: "creationTime",
    header: "Creation Time",
    cell: ({ row }) => {
      const regulation = row.original

      return moment(regulation.creationTime).format("DD/MM/YYYY HH:mm:ss")
    },
  },
]
const MonthlyInterestOutputSchema = z.object({})

export type MonthlyInterestOutputFormValues = z.infer<typeof MonthlyInterestOutputSchema>

const metadata: Metadata<MonthlyInterestOutput, MonthlyInterestOutputFormValues> = {
  getUrl: "/monthly-saving-interest",
  selectMultipleRow: true,
}

const TransactionTicketPage = () => {
  return <DataTable columns={columns} metadata={metadata} />
}

export default TransactionTicketPage
