"use client"
import React, { useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"

import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import proxyService from "../../../../utils/proxyService"
import { usePathname, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/app/reducers/store"
import { pageChange, reset, updateTotalRow } from "@/app/reducers/datatableReducer"
import { MoreHorizontal, Pencil } from "lucide-react"
import { Metadata } from "@/app/interfaces/metadata"
import { FieldValues } from "react-hook-form"
import { Badge } from "../../ui/badge"
import CreateModal from "./CreateModal"
import UpdateModal from "./UpdateModal"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"

interface DataTableProps<TData extends AuditedEntity, TValue, TFormValues extends FieldValues> {
  columns: ColumnDef<TData, TValue>[]
  metadata: Metadata<TData, TFormValues>
}

export function DataTablePopup<TData extends AuditedEntity, TValue, TFormValues extends FieldValues>({
  columns,
  metadata,
}: DataTableProps<TData, TValue, TFormValues>) {
  const [rowSelection, setRowSelection] = React.useState({})

  let updatedColumns: ColumnDef<TData, TValue>[] = [...columns]

  const [pageSize, setPageSize] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [data, setData] = React.useState<TData[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const path = usePathname()
  const pathRef = useRef(true)

  const fetchData = async (url: string, params?: any) => {
    const res = await proxyService.get(url, params)

    const content = res.data

    if (res.status === 200) {
      setData((content.items as TData[]) ?? [])
      setTotalCount(content.totalCount)
    }
  }

  useEffect(() => {
    fetchData(metadata.getUrl, { skip: 0, max: pageSize })
  }, [])

  const table = useReactTable({
    data,
    columns: updatedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  useEffect(() => {
    table.setPageSize(pageSize)
  }, [])

  const onPage = (current: number, size: number) => {
    fetchData(metadata.getUrl, { skip: (current - 1) * size, max: size })
    setCurrentPage(current)
  }

  if (!data) {
    return null
  }

  return (
    <div>
      <div className="flex mb-2 justify-center items-center">
        <Card className="w-full flex flex-row justify-center items-center p-2 rounded-none">
          <div className="flex-1">
            <Badge className=" bg-green-600 text-white text-sm " variant="outline">
              {" "}
              Total {totalCount}
            </Badge>
          </div>
        </Card>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 mt-2">
        <div className="flex-1 text-sm text-muted-foreground"></div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {Math.ceil(totalCount / table.getState().pagination.pageSize)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                onPage(1, pageSize)
              }}
              disabled={currentPage <= 1}>
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPage(currentPage - 1, pageSize)
              }}
              disabled={currentPage <= 1}>
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPage(currentPage + 1, pageSize)
              }}
              disabled={currentPage >= Math.ceil(totalCount / table.getState().pagination.pageSize)}>
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                onPage(Math.ceil(totalCount / table.getState().pagination.pageSize), pageSize)
              }}
              disabled={currentPage >= Math.ceil(totalCount / table.getState().pagination.pageSize)}>
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
