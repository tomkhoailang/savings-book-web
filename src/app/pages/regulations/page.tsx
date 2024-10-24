"use client"
import moment from "moment"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/common/datatable"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, List, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
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
import { CreateUpdateRegulationModal } from "@/components/regulations/CreateUpdateModal"
export interface SavingType {
  name: string
  term: number
  interestRate: number
}

export interface SavingRegulation extends AuditedEntity {
  minWithdrawValue: number
  savingTypes: SavingType[]
  minWithdrawDay: number
  isActive: boolean
}

const columns: ColumnDef<SavingRegulation>[] = [
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
    accessorKey: "minWithdrawDay",
    header: "Min Withdraw Day",
  },
  {
    accessorKey: "minWithdrawValue",
    header: "Min Withdraw Value",
  },
  {
    header: "Regulation List",
    cell: ({ row }) => {
      const regulation = row.original

      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <List />
            </TooltipTrigger>
            <TooltipContent side="right">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Saving Type</TableHead>
                    <TableHead className="text-white">Term</TableHead>
                    <TableHead className="text-white">Interest Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regulation.savingTypes.map((saving, index) => (
                    <TableRow key={`${regulation.id}-${index}`}>
                      <TableCell className="font-medium">
                        {saving.name}
                      </TableCell>
                      <TableCell>{saving.term}</TableCell>
                      <TableCell>{saving.interestRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    cell: ({ row }) => {
      const regulation = row.original
      if (regulation.isActive) {
        return <Check className="text-green-400" />
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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
const metadata: Metadata<SavingRegulation> = {
  url: "/regulation",
  createUpdateModal: (data) => {
    return <CreateUpdateRegulationModal data={data} />
  },
  handleResponseData: (data) => {
    return data
  },
}

const RegulationPage = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} metadata={metadata} />
    </div>
  )
}

export default RegulationPage
