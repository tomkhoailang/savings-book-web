"use client"
import moment from "moment"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { BookDown, ChartArea, Check, List, MoreHorizontal } from "lucide-react"
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
import { useState } from "react"
import { DataTablePopup } from "@/components/common/datatable/DatatablePopup"

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

export type MonthlyInterestOutputFormValues = z.infer<
  typeof MonthlyInterestOutputSchema
>

const metadata: Metadata<
  MonthlyInterestOutput,
  MonthlyInterestOutputFormValues
> = {
  getUrl: "/monthly-saving-interest",
  selectMultipleRow: true,
}

const MonthlyInterestPopup = ({ bookID }: { bookID: any }) => {
  const metadata: Metadata<
    MonthlyInterestOutput,
    MonthlyInterestOutputFormValues
  > = {
    getUrl: "/saving-book/" + bookID + "/monthly-interest",
    selectMultipleRow: true,
  }
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-center space-x-2 text-center cursor-pointer text-green-500">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {" "}
            <ChartArea /> <span>Monthly Interests</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Monthly Interests</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DataTablePopup columns={columns} metadata={metadata} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MonthlyInterestPopup
