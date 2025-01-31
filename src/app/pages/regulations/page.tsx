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

export interface SavingType {
  name: string
  term: number
  interestRate: number
}

export interface SavingRegulation extends AuditedEntity {
  minWithdrawValue: number
  savingTypes: SavingType[]
  minWithdrawDay: number
}

const columns: ColumnDef<SavingRegulation>[] = [
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
                    <TableHead>Saving Type</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Interest Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regulation.savingTypes.map((saving, index) => (
                    <TableRow key={`${regulation.id}-${index}`}>
                      <TableCell className="font-medium">{saving.name}</TableCell>
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
      return moment(regulation.lastModificationTime).format("DD/MM/YYYY HH:mm:ss")
    },
    header: "Last Modification Time",
  },
]

const SavingTypeFormSchema = z.object({
  name: z.string(),
  term: z.number(),
  interestRate: z.number(),
})
const SavingRegulationSchema = z.object({
  minWithdrawValue: z.number().min(10, { message: "Min withdraw value must be at least 10" }),
  savingTypes: z
    .array(SavingTypeFormSchema)
    .refine((savingTypes) => savingTypes.filter((type) => type.term === 0).length === 1, {
      message: "Must have only one zero term",
    })
    .refine(
      (savingTypes) => {
        const sortedSavingTypes = savingTypes.sort((a, b) => a.term - b.term)

        for (let i = 1; i < savingTypes.length; i++) {
          if (sortedSavingTypes[i].interestRate <= sortedSavingTypes[i - 1].interestRate) {
            return false
          }
        }
        return true
      },
      {
        message: "For longer terms, the interest rate must be higher than shorter terms.",
      }
    )
    .refine(
      (savingTypes) => {
        const uniqueSavingTypes = new Set(savingTypes.map((type) => `${type.name}-${type.term}-${type.interestRate}`))
        return uniqueSavingTypes.size === savingTypes.length
      },
      {
        message: "Each combination of name, term, and interest rate must be unique.",
      }
    ),

  minWithdrawDay: z.number().min(1, { message: "Min withdraw day must be at least 1" }),
  isActive: z.boolean(),
})

export type SavingRegulationFormValues = z.infer<typeof SavingRegulationSchema>
export type SavingTypeFormValues = z.infer<typeof SavingTypeFormSchema>

const metadata: Metadata<SavingRegulation, SavingRegulationFormValues> = {
  getUrl: "/regulation",
  deleteUrl: "/regulation",
  selectMultipleRow: true,
  create: {
    component: (data) => {
      return <CreateUpdateRegulationModal data={data} />
    },
    url: "/regulation",
    role: "Admin"
  },
  update: {
    component: (data) => {
      return <CreateUpdateRegulationModal data={data} />
    },
    url: "/regulation",
    role: "Admin"
  },
  formSchema: zodResolver(SavingRegulationSchema),
  getDefaultValue: (data) => {
    return {
      isActive: data ? data.isActive : true,
      minWithdrawDay: data ? data.minWithdrawDay : 10,
      minWithdrawValue: data ? data.minWithdrawValue : 10,
      savingTypes: data ? data.savingTypes : [{ name: "Zero", interestRate: 0.05, term: 0 }],
    }
  },
}

const RegulationPage = () => {
  return <DataTable columns={columns} metadata={metadata} />
}

export default RegulationPage
