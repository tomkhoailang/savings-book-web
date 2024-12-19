"use client"
import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import proxyService from "../../../../utils/proxyService"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/app/reducers/store"
import { pageChange, updateTotalRow } from "@/app/reducers/datatableReducer"
import { MoreHorizontal, Pencil } from "lucide-react"
import { Metadata } from "@/app/interfaces/metadata"
import { FieldValues } from "react-hook-form"
import { Badge } from "../../ui/badge"
import CreateModal from "./CreateModal"
import UpdateModal from "./UpdateModal"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"

interface DataTableProps<
  TData extends AuditedEntity,
  TValue,
  TFormValues extends FieldValues
> {
  columns: ColumnDef<TData, TValue>[]
  metadata: Metadata<TData, TFormValues>
}

export function DataTable<
  TData extends AuditedEntity,
  TValue,
  TFormValues extends FieldValues
  >({ columns, metadata }: DataTableProps<TData, TValue, TFormValues>) {
  const dispatch = useDispatch()
  const datatableReducer = useSelector(
    (state: RootState) => state.datatableReducer
  )
  const socketReducer = useSelector((state: RootState) => state.socketReducer)

  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedRowForUpdate, setSelectedRowForUpdate] =
    React.useState<TData | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)

  let updatedColumns: ColumnDef<TData, TValue>[] = [...columns]
  if (metadata.selectMultipleRow) {
    updatedColumns.unshift({
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
    })
  }
  if (metadata.update) {
    updatedColumns.push({
      id: "actions",
      cell: ({ row }: { row: Row<TData> }) => {
        const regulation = row.original
        return (
          <div
            className="cursor-pointer bg-green-500 rounded-full p-2 inline-flex items-center justify-center"
            onClick={() => {
              setSelectedRowForUpdate(regulation as TData)
              setIsUpdateModalOpen(true)
            }}
          >
            <Pencil size={20} className="text-white" />
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    })
  }

  const [pageSize, setPageSize] = React.useState(25)
  const [data, setData] = React.useState<TData[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const fetchData = async (url: string) => {
    const res = await proxyService.get(url)

    const content = res.data

    if (res.status === 200) {
      setData((content.items as TData[]) ?? [])
      setTotalCount(content.totalCount)
      dispatch(updateTotalRow(content.totalCount))
    }
  }
  const whenUpdateClose = (resData: TData) => {
    const newData = data.map((item) => {
      if (item.id == resData.id) {
        return resData
      }
      return item
    })
    setData(newData)
  }
  const whenCreateClose = (resData: TData) => {
    const newData = [resData, ...data]
    setData(newData)
    dispatch(updateTotalRow(datatableReducer.totalCount + 1))
  }

  const handleDelete = async () => {
    const filteredData = data
      .filter((item, index) => {
        return index in rowSelection
      })
      .map((item) => item.id)
    const res = await proxyService.delete(
      `${metadata.deleteUrl}?ids=${filteredData.join(",")}`
    )

    if (res.status === 204) {
      const newLength = data.length - filteredData.length
      if (newLength === 0 && datatableReducer.pagination.current > 1) {
        dispatch(
          pageChange({
            current: datatableReducer.pagination.current - 1,
            size: datatableReducer.pagination.size,
          })
        )
      } else {
        fetchData(metadata.getUrl + datatableReducer.query)
      }
      setRowSelection({})
      setIsDeleteModalOpen(false)
    }
  }

  // useEffect(() => {
  //   fetchData(metadata.getUrl)
  // }, [])

  useEffect(() => {
    fetchData(metadata.getUrl + datatableReducer.query)
  }, [datatableReducer.query])
  useEffect(() => {
    setTotalCount(datatableReducer.totalCount)
  }, [datatableReducer.totalCount])
  useEffect(() => {
    setPageSize(datatableReducer.pagination.size)
  }, [datatableReducer.pagination.size])

  useEffect(() => {
    if (metadata.socket && socketReducer.type !== "") {
      metadata.socket.map((socketProp) => {
        if (socketProp.type === socketReducer.type) {
          console.log("hitted", data, socketReducer);
          
          const updatedData = data.map((item) => {
            if (item.id === socketReducer.data.data.id) {
              return socketReducer.data.data
            }
            return item
          })
          setData(updatedData)
        }
      })
    }
  }, [socketReducer])

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
    console.log(current)
    dispatch(pageChange({ current, size }))
    setRowSelection({})
  }

  if (!data) {
    return null
  }

  return (
    <div>
      <div className="flex mb-2 justify-center items-center">
        <Card className="w-full flex flex-row justify-center items-center p-2 rounded-none">
          <div className="flex-1">
            <Badge
              className=" bg-green-600 text-white text-sm "
              variant="outline"
            >
              {" "}
              Total {totalCount}
            </Badge>
          </div>
          <div className="space-x-5 flex flex-row justify-center">
            {metadata.create && <Button
              className="bg-green-600 rounded-lg"
              onClick={() => {
                setIsCreateModalOpen(true)
              }}
            >
              Create
            </Button>}

            {metadata.deleteUrl && (
              <AlertDialog open={isDeleteModalOpen}>
              <Button
                className="bg-red-500 rounded-lg"
                onClick={() => {
                  setIsDeleteModalOpen(true)
                }}
                disabled={
                  table.getFilteredSelectedRowModel().rows.length === 0
                }
              >
                Delete
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    current data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setIsDeleteModalOpen(false)
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDelete()
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            )}
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 mt-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {data.length > pageSize ? pageSize : data.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
                dispatch(pageChange({ current: 1, size: Number(value) }))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {datatableReducer.sizePerPage.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {datatableReducer.pagination.current} of{" "}
            {Math.ceil(totalCount / table.getState().pagination.pageSize)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                onPage(1, pageSize)
              }}
              disabled={datatableReducer.pagination.current <= 1}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPage(datatableReducer.pagination.current - 1, pageSize)
              }}
              disabled={datatableReducer.pagination.current <= 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                console.log(datatableReducer.pagination.current + 1)
                onPage(datatableReducer.pagination.current + 1, pageSize)
              }}
              disabled={
                datatableReducer.pagination.current >=
                Math.ceil(totalCount / table.getState().pagination.pageSize)
              }
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                onPage(
                  Math.ceil(totalCount / table.getState().pagination.pageSize),
                  pageSize
                )
              }}
              disabled={
                datatableReducer.pagination.current >=
                Math.ceil(totalCount / table.getState().pagination.pageSize)
              }
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {metadata.update && (
        <UpdateModal
          metadata={metadata}
          isOpen={isUpdateModalOpen}
          setIsOpen={setIsUpdateModalOpen}
          dataSource={selectedRowForUpdate}
          whenClose={whenUpdateClose}
        />
      ) }
      {metadata.create && (
        <CreateModal
          metadata={metadata}
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          dataSource={null}
          whenClose={whenCreateClose}
        />
      ) }
    </div>
  )
}
