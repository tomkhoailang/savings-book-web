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

const TransactionTicketSchema = z.object({})

export type TransactionTicketFormValues = z.infer<
  typeof TransactionTicketSchema
>

const NotificationPopUp = ({ ticketID }: { ticketID: any }) => {
  const [data, setData] = React.useState<TransactionTicket>()
  const [open, setOpen] = useState(false)

  const fetchData = async (url: string) => {
    const res = await proxyService.get(url)

    const content = res.data

    if (res.status === 200) {
      setData(content.result)
    }
  }
  useEffect(() => {
    fetchData("/transaction-ticket/" + ticketID)
  }, [open])
  console.log("data", data)

  return (
    <div className="flex justify-center space-x-2 text-center cursor-pointer text-green-500">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {" "}
            <Mail /> <span>Read</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Transaction Detail</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DialogDescription>
            Payment ID:
            <span className="font-bold"> {data?.paymentId}</span>
            <br />
            Email:
            <span className="font-bold"> {data?.email}</span>
            <br />
            Payment Amount:
            <span className="font-bold"> {data?.paymentAmount}$</span>
            <br />
            Payment Type:
            <span className="font-bold">
              {" "}
              {transactionTypeDict[data?.paymentType ?? ""] || "Unknown"}
            </span>
            <br />
            Transaction Result:
            <span className="font-bold">
              {" "}
              {transactionStatusDict[data?.status ?? ""] || "Unknown"}
            </span>
            <br />
            Creation Time:
            <span className="font-bold">
              {" "}
              {moment(data?.creationTime).format("DD/MM/YYYY HH:mm:ss")}
            </span>
            <br />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NotificationPopUp
