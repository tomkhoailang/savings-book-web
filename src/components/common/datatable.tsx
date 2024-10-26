"use client"
import React, {useEffect} from "react"
import {Button} from "@/components/ui/button"

import {ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon,} from "@radix-ui/react-icons"
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"

import {ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, Row, useReactTable,} from "@tanstack/react-table"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import proxyService from "@/app/services/proxyService"
import {useRouter} from "next/navigation"
import {useToast} from "@/hooks/use-toast"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "@/app/reducers/store"
import {pageChange, updateTotalRow} from "@/app/reducers/datatableReducer"
import UpdateModal from "./updateModal"
import {MoreHorizontal} from "lucide-react"
import {Metadata} from "@/app/interfaces/metadata"
import {FieldValues} from "react-hook-form"
import {Badge} from "../ui/badge"
import CreateModal from "./createModal"

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
>({columns, metadata}: DataTableProps<TData, TValue, TFormValues>) {
  const dispatch = useDispatch()
  const datatableReducer = useSelector(
    (state: RootState) => state.datatableReducer
  )


  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedRowForUpdate, setSelectedRowForUpdate] =
    React.useState<TData | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)

  const updatedColumns: ColumnDef<TData, TValue>[] = columns.map((column) => {
    if (column.id === "actions") {
      return {
        ...column,
        cell: ({row}: { row: Row<TData> }) => {
          const regulation = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRowForUpdate(regulation as TData)
                    setIsUpdateModalOpen(true)
                    console.log("test")
                  }}
                >
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }
    }
    return column
  })

  const [pageSize, setPageSize] = React.useState(25)
  const [data, setData] = React.useState<TData[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const router = useRouter()
  const {toast} = useToast()

  const fetchData = async (url: string) => {
    const res = await proxyService.get(url)
    if (res.status == 401) {
      router.push("/login")
      toast({
        title: "Unauthorized",
        description: "You don't have enough permission to access this page",
        duration: 1500,
        className: "w-2/6 fixed top-8 right-16 bg-red-500 text-white",
      })
      return
    }
    const content = await res.json()

    if (!res.ok) {
    } else {
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
    const filteredData = data.filter((item, index) => {
      return index in rowSelection
    }).map(item => item.id)
    const res = await proxyService.delete(`/regulation?ids=${filteredData.join(",")}`)

    if (res.status !== 204) {
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 1500,
        className: "w-2/6 fixed top-8 right-16 bg-red-500 text-white",
      })
    } else {
      toast({
        title: "Successfully",
        description: "Delete data completely",
        duration: 1500,
        className: "w-1/4 fixed top-8 right-16 bg-green-500 text-white",
      })

      const newData = data.filter((item) => {
        return item.id != null && !filteredData.includes(item.id)
      })
      const newLength = data.length - filteredData.length

      if (newLength === 0 && datatableReducer.pagination.current > 1) {
        dispatch(pageChange({current: datatableReducer.pagination.current - 1, size: datatableReducer.pagination.size}))
      } else {
        fetchData(metadata.getUrl + datatableReducer.query)

      }
      setRowSelection({})
      setIsDeleteModalOpen(false)

    }

  }

  useEffect(() => {
    fetchData(metadata.getUrl)
  }, [])

  useEffect(() => {
    fetchData(metadata.getUrl + datatableReducer.query)
  }, [datatableReducer.query])
  useEffect(() => {
    setTotalCount(datatableReducer.totalCount)
  }, [datatableReducer.totalCount])
  useEffect(() => {
    setPageSize(datatableReducer.pagination.size)
  }, [datatableReducer.pagination.size])


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
    console.log(current);
    dispatch(pageChange({current, size}))
    setRowSelection({})
  }

  if (!data) {
    return null
  }

  return (
    <div>
      <div className="flex mb-2 justify-center items-center">
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
          <Button
            className="bg-green-600 rounded-lg"
            onClick={() => {
              setIsCreateModalOpen(true)
            }}
          >
            Create
          </Button>
          <AlertDialog open={isDeleteModalOpen}>
            <Button
              className="bg-red-500 rounded-lg"
              onClick={() => {
                setIsDeleteModalOpen(true)
              }}
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            >
              Delete
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
        </div>
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
          {table.getFilteredSelectedRowModel().rows.length} of {data.length > pageSize ? pageSize : data.length}{" "}
          row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
                dispatch(pageChange({current: 1, size: Number(value)}))
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
              <DoubleArrowLeftIcon className="h-4 w-4"/>
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
              <ChevronLeftIcon className="h-4 w-4"/>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                console.log(datatableReducer.pagination.current + 1);
                onPage(datatableReducer.pagination.current + 1, pageSize)
              }
              }
              disabled={
                datatableReducer.pagination.current >=
                Math.ceil(totalCount / table.getState().pagination.pageSize)
              }
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4"/>
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                onPage(Math.ceil(
                  totalCount / table.getState().pagination.pageSize
                ), pageSize)
              }}
              disabled={
                datatableReducer.pagination.current >=
                Math.ceil(totalCount / table.getState().pagination.pageSize)
              }
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>

      {metadata.update !== null ? (
        <UpdateModal
          metadata={metadata}
          isOpen={isUpdateModalOpen}
          setIsOpen={setIsUpdateModalOpen}
          dataSource={selectedRowForUpdate}
          whenClose={whenUpdateClose}
        />
      ) : (
        ""
      )}
      {metadata.create !== null ? (
        <CreateModal
          metadata={metadata}
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          dataSource={null}
          whenClose={whenCreateClose}
        />
      ) : (
        ""
      )}
    </div>
  )
}
