"use client"
import {
  AddressFormValues,
  Regulation,
  SavingBook as SavingBook,
  SavingBookFormValues,
} from "@/app/pages/savings-book/page"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Controller, useForm, useFormContext } from "react-hook-form"
import TextInput from "../../common/InputText"
import { Checkbox } from "../../ui/checkbox"
import { CircleMinus, MoreHorizontal, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import proxyService from "@/app/services/proxyService"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownItem } from "@nextui-org/react"
import Address from "@/app/interfaces/address"
import moment from "moment"

export function CreateSavingBookModal({ data }: { data: SavingBook | null }) {
  interface SavingType {
    name: string
    term: number
    interestRate: number
  }

  const savingBookForm = useFormContext<SavingBookFormValues>()

  const [isOpen, setIsOpen] = useState(false)
  const term = data?.regulations.at(data.regulations.length - 1)?.termInMonth
  const defaultTerm = term === 0 ? "Zero" : term
  const defaultInterestRate = data?.regulations.at(
    data.regulations.length - 1
  )?.interestRate

  const defaultAddress: Address = {
    street: "",
    city: "",
    country: "",
  }

  const [address, setAddress] = useState<Address>(
    data ? data.address : defaultAddress
  )

  const [regulation, setRegulation] = useState<Regulation>()
  const lastModificationTime =
    data?.lastModificationTime &&
    new Date(data.lastModificationTime).getFullYear() !== 1
      ? moment(data.lastModificationTime).format("DD/MM/YYYY HH:mm:ss")
      : ""

  useEffect(() => {
    savingBookForm.reset()
    setRegulation(data?.regulations[data.regulations.length - 1])
  }, [isOpen])

  const [savingTypes, setSavingTypes] = useState<SavingType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSavingTypes = async () => {
      try {
        const response = await proxyService.get("/regulation/latest")
        const content = await response.json()
        if (content) {
          setSavingTypes(content.savingTypes)
          console.log("Fetched Saving Types:", content.savingTypes)
        }
      } catch (err) {
        setError("Failed to fetch saving types.")
      } finally {
        setLoading(false)
      }
    }

    fetchSavingTypes()
  }, [])

  useEffect(() => {
    console.log("Updated Saving Types:", savingTypes)
  }, [savingTypes])

  return (
    <>
      <div className="flex flex-row justify-between space-x-5">
        <TextInput
          control={savingBookForm.control}
          name="idCardNumber"
          label="ID Card Number"
          placeholder="ID Card Number"
          className=" w-1/2"
        />

        {data?.creationTime ? (
          <TextInput
            control={savingBookForm.control}
            name="balance"
            label="Balance"
            placeholder="Balance"
            className=" w-1/2"
            number
          />
        ) : (
          <TextInput
            control={savingBookForm.control}
            name="newPaymentAmount"
            label="Balance"
            placeholder="Balance"
            className=" w-1/2"
            number
          />
        )}
      </div>
      <div className="flex flex-row justify-between space-x-5">Address</div>
      <div className="flex flex-row justify-between space-x-5">
        <TextInput
          control={savingBookForm.control}
          name="address.street"
          label="Street"
          placeholder="Street"
          className=" w-1/2"
        />
        <TextInput
          control={savingBookForm.control}
          name="address.city"
          label="City"
          placeholder="City"
          className=" w-1/2"
        />
        <TextInput
          control={savingBookForm.control}
          name="address.country"
          label="Country"
          placeholder="Country"
          className=" w-1/2"
        />
      </div>
      {data?.creationTime && (
        <div className="flex flex-row justify-between space-x-5">
          <TextInput
            control={savingBookForm.control}
            name="regulations.termInMonth"
            label="Term"
            placeholder="Term"
            className=" w-1/2"
          />
          <TextInput
            control={savingBookForm.control}
            name="regulations.interestRate"
            label="Interest Rate"
            placeholder="Interest Rate"
            className=" w-1/2"
          />
        </div>
      )}
      {data?.creationTime ? (
        <div className="flex flex-row justify-between space-x-5">
          <TextInput
            control={savingBookForm.control}
            name="creationTime"
            label="Creation Time"
            placeholder="Creation Time"
            defaultValue={moment(data.creationTime).format(
              "DD/MM/YYYY HH:mm:ss"
            )}
            className=" w-1/2"
          />
          <TextInput
            control={savingBookForm.control}
            name="lastModificationTime"
            label="Last Modification Time"
            placeholder="Last Modification Time"
            defaultValue={moment(data.lastModificationTime).format(
              "DD/MM/YYYY HH:mm:ss"
            )}
            className=" w-1/2"
          />
        </div>
      ) : (
        <div className="flex flex-row justify-between space-x-5">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Term
            </label>
            <Select
              onValueChange={(value) => {
                savingBookForm.setValue("term", parseInt(value))
                const interestRate = savingTypes.find(
                  (type) => type.term === parseInt(value)
                )?.interestRate
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a term" />
              </SelectTrigger>
              <SelectContent>
                {savingTypes.map((type) => (
                  <SelectItem key={type.term} value={type.term.toString()}>
                    {type.term === 0
                      ? `Indefinitely - ${type.interestRate}%`
                      : `Term: ${type.term} months - ${type.interestRate}%`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  )
}
