"use client"
import moment from "moment"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BookDown,
  Check,
  History,
  List,
  Mail,
  MoreHorizontal,
} from "lucide-react"
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
import React from "react"
import proxyService from "../../../../utils/proxyService"
import { Notification } from "@/components/common/Notification"

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
  creatorId: string
  paymentAmount: number
}

const TransactionTicketSchema = z.object({})

export type TransactionTicketFormValues = z.infer<
  typeof TransactionTicketSchema
>

const NotificationPopUp = ({ ticketID }: { ticketID: Notification }) => {
  const [data, setData] = React.useState<TransactionTicket>()
  const [open, setOpen] = useState(false)

  const fetchData = async (url: string) => {
    const res = await proxyService.get(url)

    const content = res.data

    if (res.status === 200) {
      setData(content)
    }
  }
  useEffect(() => {
    if (open) fetchData("/transaction-ticket/" + ticketID.transactionTicketId)
  }, [open])
  console.log("data", data)

  return (
    <div className="flex flex-col space-x-2  cursor-pointer text-green-500">
      {ticketID.message}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <span>View Details</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Transaction Detail</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DialogDescription>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 ">
              <div>
                <span className="text-gray-600">Transaction Time:</span>
                <span className="font-bold ml-2">
                  {moment(data?.creationTime).format("DD/MM/YYYY HH:mm:ss")}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="font-bold ml-2">{data?.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Amount:</span>
                <span className="font-bold ml-2">{data?.paymentAmount}$</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Type:</span>
                <span className="font-bold ml-2">
                  {transactionTypeDict[data?.paymentType ?? ""] || "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Transaction Result:</span>
                <span className="font-bold ml-2">
                  {transactionStatusDict[data?.status ?? ""] || "Unknown"}
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NotificationPopUp
