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
import TextInput from "../../common/TextInput"
import { Checkbox } from "../../ui/checkbox"
import { CircleMinus, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import proxyService from "../../../../utils/proxyService"
import NumberInput from "@/components/common/NumberInput"

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
    const lastSavingType = savingType.reduce((max, current) => {
      return current.interestRate > max.interestRate ? current: max
    }, savingType[0])

    let newSavingType = {
      interestRate: parseFloat(
        (lastSavingType?.interestRate + 0.05).toFixed(2)
      ),
      name: "",
      term: lastSavingType?.term + 1,
    }

    if (regulationForm.formState.errors.savingTypes) {
      newSavingType.term = 0
      newSavingType.interestRate = parseFloat(
        (lastSavingType?.interestRate - 0.01).toFixed(2)
      )
    }

    setSavingType([...savingType, newSavingType])
    regulationForm.setValue(
      `savingTypes[${savingType.length}]` as any,
      newSavingType
    )
  }
  const onRemoveSavingTypeBtn = (id: number) => {
    setSavingType(savingType.filter((type, index) => index !== id))
  }

  useEffect(() => {
    regulationForm.reset()
    setSavingType(data ? data.savingTypes : [defaultSavingType])
  }, [isOpen])

  const onRowContentChange = () => {
    setSavingType(regulationForm.getValues("savingTypes"))
  }

  return (
    <>
      <div className="flex flex-row justify-between space-x-5">
        <NumberInput
          control={regulationForm.control}
          name="minWithdrawValue"
          label="Min Withdraw Value"
          placeholder="Min Withdraw Value"
          className=" w-1/2"
          decimalPoint={2}
          min={10}
        />
        <NumberInput
          control={regulationForm.control}
          name="minWithdrawDay"
          label="Min Withdraw Day"
          placeholder="Min Withdraw Day"
          className=" w-1/2"
          min={10}
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
                    <TextInput
                      name={`savingTypes[${index}].name`}
                      className="w-full"
                      required={false}
                      control={regulationForm.control}
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <NumberInput
                      control={regulationForm.control}
                      name={`savingTypes[${index}].term`}
                      max={120}
                      placeholder="Default: 0"
                      required={false}
                      change={onRowContentChange}
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <NumberInput
                      control={regulationForm.control}
                      name={`savingTypes[${index}].interestRate`}
                      placeholder="Interest rate"
                      required={false}
                      decimalPoint={2}
                      step={0.01}
                      min={0.01}
                      max={10}
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
