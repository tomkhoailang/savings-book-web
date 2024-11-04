"use client"
import {
  SavingRegulation,
  SavingRegulationFormValues,
  SavingType,
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
import TextInput from "../../common/InputText"
import { Checkbox } from "../../ui/checkbox"
import { CircleMinus, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import proxyService from "@/app/services/proxyService"

export function CreateUpdateRegulationModal({
  data,
}: {
  data: SavingRegulation | null
}) {
  const regulationForm = useFormContext<SavingRegulationFormValues>()

  const defaultSavingType: SavingType = {
    name: "Zero",
    interestRate: 0.05,
    term: 0,
  }

  const [savingType, setSavingType] = useState<SavingTypeFormValues[]>(
    data ? data.savingTypes : [defaultSavingType]
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    regulationForm.setValue("savingTypes", [...savingType])
    regulationForm.trigger("savingTypes")
  }, [savingType])

  const onAddSavingTypeBtn = () => {
    const lastSavingType = savingType[savingType.length - 1]

    setSavingType([
      ...savingType,
      {
        interestRate: parseFloat(
          (lastSavingType?.interestRate + 0.05).toFixed(2)
        ),
        name: "",
        term: lastSavingType?.term + 1,
      },
    ])
  }
  const onRemoveSavingTypeBtn = (id: number) => {
    setSavingType(savingType.filter((type, index) => index !== id))
  }

  useEffect(() => {
    regulationForm.reset()
    setSavingType(data ? data.savingTypes : [defaultSavingType])
  }, [isOpen])

  const onRowContentChange = (
    index: number,
    field: keyof SavingType,
    value: string
  ) => {
    setSavingType(
      savingType.map((type, id) => {
        return id === index
          ? {
              ...type,
              [field]:
                field === "name"
                  ? value
                  : parseFloat(value) >= 0
                  ? parseFloat(value)
                  : 0,
            }
          : type
      })
    )
  }

  return (
    <>
      <div className="flex flex-row justify-between space-x-5">
        <TextInput
          control={regulationForm.control}
          name="minWithdrawValue"
          label="Min Withdraw Value"
          placeholder="Min Withdraw Value"
          className=" w-1/2"
          number
        />
        <TextInput
          control={regulationForm.control}
          name="minWithdrawDay"
          label="Min Withdraw Day"
          placeholder="Min Withdraw Day"
          className=" w-1/2"
          number
        />
      </div>
      <div className="mt-2">
        <Button
          className="w-2/5"
          onClick={(e) => {
            e.preventDefault()
            onAddSavingTypeBtn()
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Regulation
        </Button>
        <ScrollArea className="h-[250px]  mt-4">
          <Table>
            <TableCaption>A list of regulations.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Saving Type</TableHead>
                <TableHead>Term(Month)</TableHead>
                <TableHead>Interest Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savingType.map((saving, index) => (
                <TableRow key={`${data?.id}-${index}`}>
                  <TableCell className="p-2">
                    <Input
                      value={saving.name}
                      onChange={(e) =>
                        onRowContentChange(index, "name", e.target.value)
                      }
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      value={saving.term}
                      onChange={(e) => {
                        const value = Math.min(Number(e.target.value), 120)
                        onRowContentChange(index, "term", value.toString())
                      }}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={saving.interestRate}
                      onChange={(e) =>
                        onRowContentChange(
                          index,
                          "interestRate",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    {saving.term == 0 ? (
                      ""
                    ) : (
                      <CircleMinus
                        className="text-red-500 cursor-pointer"
                        onClick={() => onRemoveSavingTypeBtn(index)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {regulationForm.formState.errors.savingTypes?.message && (
          <p className="text-red-500">
            {regulationForm.formState.errors.savingTypes.message}
          </p>
        )}
      </div>
      <div className="flex mt-4">
        <Controller
          control={regulationForm.control}
          name="isActive"
          render={({ field, fieldState }) => {
            return (
              <div className="flex flex-row space-x-2 justify-center items-center">
                <Checkbox
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                ></Checkbox>
                <div>Active</div>
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
