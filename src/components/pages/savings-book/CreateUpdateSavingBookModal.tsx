"use client"
import {
  SavingRegulation,
  SavingRegulationFormValues,
  SavingTypeFormValues,
} from "@/app/pages/regulations/page"
import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Controller, useForm, useFormContext } from "react-hook-form"
import TextInput from "../../common/TextInput"
import { Checkbox } from "../../ui/checkbox"
import { CircleMinus, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import proxyService from "../../../../utils/proxyService"
import { SavingBook, SavingBookFormValues } from "@/app/pages/savings-book/page"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DropdownControl from "@/components/common/DropdownControl"
import NumberInput from "@/components/common/NumberInput"

interface SavingType {
  name: string
  term: number
  interestRate: number
}

export function CreateUpdateSavingBookModal({
  data,
}: {
  data: SavingBook | null
}) {
  const savingBookForm = useFormContext<SavingBookFormValues>()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    savingBookForm.reset()
  }, [isOpen])

  const [latestRegulation, setLatestRegulation] = useState<SavingRegulation>()

  useEffect(() => {
    fetchLatestSavingType()
  }, [])

  const fetchLatestSavingType = async () => {
    try {
      const response = await proxyService.get("/regulation/latest")
      const content = response.data
      if (content) {
        setLatestRegulation(content)
      }
    } catch (err) {}
  }

  if (!latestRegulation) {
    return ""
  }

  const latestRegulationMap = latestRegulation.savingTypes.map((item, index) => {
    return {
      value: item.term,
      label: item.term === 0  ? `Demand deposit - ${item.interestRate}%` : `Term: ${item.term} months - ${item.interestRate}%`}
    }
  )

  return (
    <>
      <div>Our regulation
        <div>
          Min withdraw day: <span className="font-bold">{latestRegulation.minWithdrawDay} days</span>
          <br/>
          Min deposit value: <span className="font-bold">{latestRegulation.minWithdrawValue }$</span>
        </div>
      </div>
      <div className="flex flex-row justify-between space-x-5">
        <TextInput
          control={savingBookForm.control}
          name="idCardNumber"
          label="ID Card Number"
          placeholder="ID Card Number"
          className=" w-1/2"
          maxlength={12}
          required
        />
        <NumberInput
          control={savingBookForm.control}
          name="newPaymentAmount"
          label="Balance"
          defaultValue={latestRegulation.minWithdrawValue}
          placeholder="Balance"
          className=" w-1/2"
          required
          decimalPoint={0}
          min={latestRegulation.minWithdrawValue}

        />
      </div>
      <div className="flex flex-col justify-between  space-y-2">
        <div className="flex flex-row space-x-5 ">
          <TextInput
            control={savingBookForm.control}
            name="address.street"
            label="Street"
            placeholder="Street"
            className=" w-3/4"
          />
          <TextInput
            control={savingBookForm.control}
            name="address.city"
            label="City"
            placeholder="City"
            className=" w-1/4"
          />
        </div>
        <div className="flex flex-row space-x-5 ">
          <TextInput
            control={savingBookForm.control}
            name="address.country"
            label="Country"
            placeholder="Country"
            className=" w-1/2"
          />
          <TextInput
            control={savingBookForm.control}
            name="address.zipcode"
            label="Zipcode"
            placeholder="Zipcode"
            className=" w-1/2"
          />
        </div>
        
      </div>

      <div className="flex flex-row justify-between space-x-5">
        <div className="w-1/2">
          <DropdownControl
            control={savingBookForm.control}
            datasource={latestRegulationMap}
            name="term"
          />
        </div>
      </div>
    </>
  )
}
