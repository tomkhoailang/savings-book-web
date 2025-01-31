"use client"
import moment from "moment"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { BookDown, Check, History, List, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { DataTablePopup } from "@/components/common/datatable/DatatablePopup"

const transactionTypeDict: Record<string, string> = {
  deposit: "Deposit",
  withdraw: "Withdraw",
}
const transactionStatusDict: Record<string, string> = {
  success: "Success",
  pending: "Pending",
  abort: "Abort",
}

export interface TransactionTicket extends AuditedEntity {
  savingBookId: string // Equivalent to primitive.ObjectID
  transactionDate: Date
  status: string
  email: string

  paymentLink: string
  paymentType: string
  paymentId: string
  paymentAmount: number
}

const columns: ColumnDef<TransactionTicket>[] = [
  {
    accessorKey: "paymentId",
    header: "Payment ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "paymentAmount",
    header: "Payment Amount",
  },
  {
    header: "Payment Type",
    cell: ({ row }) => {
      const ticket = row.original
      return transactionTypeDict[ticket.paymentType]
    },
  },
  {
    header: "Transaction result",
    cell: ({ row }) => {
      const ticket = row.original
      return transactionStatusDict[ticket.status]
    },
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
const TransactionTicketSchema = z.object({})

export type TransactionTicketFormValues = z.infer<
  typeof TransactionTicketSchema
>

const TransactionHistoryPopUp = ({ bookID }: { bookID: any }) => {
  const metadata: Metadata<TransactionTicket, TransactionTicketFormValues> = {
    getUrl: "/saving-book/" + bookID + "/transaction-ticket",
    selectMultipleRow: true,
  }
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-center space-x-2 text-center cursor-pointer text-green-500">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" style={{width:"180px"}}>
            {" "}
            <History /> <span>Transaction History</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DataTablePopup columns={columns} metadata={metadata} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TransactionHistoryPopUp
