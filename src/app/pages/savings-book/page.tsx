"use client"
import moment from "moment"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, CreditCard, List, MoreHorizontal, SplitSquareVertical, WalletCards } from "lucide-react"

import { Metadata } from "@/app/interfaces/metadata"
import { zodResolver } from "@hookform/resolvers/zod"
import { DataTable } from "@/components/common/datatable/Datatable"
import Address, { ZodAddress } from "@/app/interfaces/common/address"
import { CreateUpdateSavingBookModal } from "@/components/pages/savings-book/CreateUpdateSavingBookModal"
import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import proxyService from "../../../../utils/proxyService"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import WithdrawSavingBookModal from "@/components/pages/savings-book/WithdrawSavingBookModal"
import { SAVING_BOOK_TRANSACTION_COMPLETE } from "../../../../utils/socket.enum"
import DepositSavingBookModal from "@/components/pages/savings-book/DepositSavingBookModal"

export interface BookRegulation {
  regulationIdRef: string
  applyDate: Date
  name: string
  termInMonth: number
  interestRate: number
  minWithDrawValue: number
  minWithDrawDay: number
  noTermInterestRate: number
}

export interface SavingBook extends AuditedEntity {
  accountId: string
  regulations: BookRegulation[]
  address: Address
  idCardNumber: string
  status: string
  paymentUrl: string
  balance: number
  pendingBalance: number
  nextScheduleMonth: Date
  isActive: boolean
  totalEarnings: number
  newPaymentAmount: number
  term: number
}

const statusMap: Record<string, string> = {
  init: "Waiting to complete payment",
  active: "Actively",
  expired: "Expired",
  closed: "Closed",
}

const columns: ColumnDef<SavingBook>[] = [
  {
    header: "Id Card Number",
    accessorKey: "idCardNumber",
  },
  {
    header: "Address",
    cell: ({ row }) => {
      const savingBook = row.original

      return `${savingBook.address?.street ?? ""} ${savingBook.address?.city ?? ""} ${savingBook.address?.country ?? ""}`
    },
  },
  {
    header: "Current Balance",
    cell: ({ row }) => {
      const savingBook = row.original

      return `${Math.floor(savingBook.balance * 100) / 100} $`
    },
  },
  {
    header: "Pending Balance",
    cell: ({ row }) => {
      const savingBook = row.original

      return `${savingBook.pendingBalance} $`
    },
  },
  {
    header: "Total Earnings",
    cell: ({ row }) => {
      const savingBook = row.original

      if(savingBook.totalEarnings)
        return `${Math.floor(savingBook.totalEarnings * 100) / 100} $`
      return ""
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const savingBook = row.original

      let latestAppliedReg

      for (let i = savingBook.regulations.length - 1; i >= 0; i--) {
        if (new Date(savingBook.regulations[i].applyDate) > new Date(0)) {
          latestAppliedReg = savingBook.regulations[i]
          break
        }
      }
      if (latestAppliedReg && latestAppliedReg.termInMonth === 0 && savingBook.balance > 0) {
        return `No term - ${statusMap[savingBook.status]}`
      }

      return `${statusMap[savingBook.status]}`
    },
  },
  {
    cell: ({ row }) => {
      const savingBook = row.original
      if (savingBook.isActive) {
        return <Check className="text-green-400 w-full" />
      }
    },
    header: "Active",
  },
  {
    accessorKey: "creationTime",
    header: "Creation Time",
    cell: ({ row }) => {
      const savingBook = row.original

      return moment(savingBook.creationTime).format("DD/MM/YYYY HH:mm:ss")
    },
  },
  {
    accessorKey: "nextSchedule",
    header: "Next Schedule Date",
    cell: ({ row }) => {
      const savingBook = row.original
      console.log(savingBook.balance)

      if (moment(savingBook.nextScheduleMonth).isBefore(moment()) || savingBook.balance === 0) {
        return ""
      }

      return moment(savingBook.nextScheduleMonth).format("DD/MM/YYYY HH:mm:ss")
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const savingBook = row.original
      return savingBook.pendingBalance !== 0 ? (
        <div
          className="flex justify-center space-x-2 text-center cursor-pointer text-green-500"
          onClick={() => {
            window.location.href = `${savingBook.paymentUrl}`
          }}>
          <CreditCard size={24} />
          <span className="leading-6">Paynow</span>
        </div>
      ) : (
        ""
      )
    },
  },
  {
    header: "Withdraw/Deposit",
    cell: ({ row }) => {
      const savingBook = row.original

      if (savingBook.paymentUrl !== "")
        return ""

      let latestAppliedReg
      for (let i = savingBook.regulations.length - 1; i >= 0; i--) {
        if (new Date(savingBook.regulations[i].applyDate) > new Date(0)) {
          latestAppliedReg = savingBook.regulations[i]
          break
        }
      }

      if (latestAppliedReg) {
        if (Math.floor(savingBook.balance * 100) / 100 < latestAppliedReg.minWithDrawValue) {
          return ""
        }

        if (savingBook.status === "expired") {

          return <div className="flex flex-row space-x-2">
            <WithdrawSavingBookModal savingBook={savingBook} />
            <DepositSavingBookModal savingBook={savingBook} />
          </div>
        }

        const now = new Date()
        const applyDate = new Date(latestAppliedReg.applyDate)

        if (Math.floor((now.getTime() - applyDate.getTime()) / 1000) > latestAppliedReg.minWithDrawDay && latestAppliedReg.termInMonth === 0) {
          return  <div className="flex flex-row space-x-2">
          <WithdrawSavingBookModal savingBook={savingBook} />
          {savingBook.paymentUrl === "" && <DepositSavingBookModal savingBook={savingBook} />}
        </div>
        }
      }

      return ""
    },
  },

  // {
  //   accessorKey: "lastModificationTime",
  //   cell: ({ row }) => {
  //     const savingBook = row.original

  //     if (new Date(savingBook.lastModificationTime).getFullYear() === 1) {
  //       return ""
  //     }
  //     return moment(savingBook.lastModificationTime).format(
  //       "DD/MM/YYYY HH:mm:ss"
  //     )
  //   },
  //   header: "Last Modification Time",
  // }
]

const SavingBookSchema = z.object({
  address: ZodAddress,
  idCardNumber: z.string().min(9, { message: "Id card number must be at least 9 character" }).max(12, { message: "Id card number cannot exceeds 12 characters" }),
  term: z.number(),
  newPaymentAmount: z.number(),
})

export type SavingBookFormValues = z.infer<typeof SavingBookSchema>

const metadata: Metadata<SavingBook, SavingBookFormValues> = {
  getUrl: "/saving-book",
  deleteUrl: "",
  selectMultipleRow: true,
  create: {
    component: (data) => {
      return <CreateUpdateSavingBookModal data={data} />
    },
    url: "/saving-book",
  },
  formSchema: zodResolver(SavingBookSchema),
  socket: [
    {
      type: SAVING_BOOK_TRANSACTION_COMPLETE,
      handleData: (oldData: any, data: any) => {
        return {
          ...data,
          totalEarnings: oldData.totalEarnings
        }
      },
    },
  ],
  getDefaultValue: (data) => {
    return {
      idCardNumber: data ? data.idCardNumber : "",
      term: data ? data.term : 0,
      newPaymentAmount: data ? data.newPaymentAmount : 10,
      address: data
        ? data.address
        : {
            country: "",
            city: "",
            street: "",
            zipCode: "",
          },
    }
  },
}

const SavingBookPage = () => {
  const params = useSearchParams()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = params.get("token")
    if (token) {
      postConfirmPayment(token)
    }
    console.log(params.get("token"))
  }, [params])

  const postConfirmPayment = async (token: string) => {
    const res = await proxyService.post("/saving-book/confirm-payment", {
      paymentId: token,
    })
    if (res.status === 200) {
      toast({
        title: "Payment Successful!",
        variant: "success",
        description: " Thank you for your payment. Your transaction has been completed.",
        duration: 1500,
      })
    } else {
      console.log("check")
    }
    router.push(pathname)
  }

  return (
    <DataTable columns={columns} metadata={metadata} />
  )
}

export default SavingBookPage
