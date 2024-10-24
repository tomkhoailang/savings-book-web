"use client"
import { SavingRegulation, SavingType } from "@/app/pages/regulations/page"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z, { number } from "zod"
import TextInput from "../common/InputText"
import { Checkbox } from "../ui/checkbox"
import { CircleMinus, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { input } from "@nextui-org/react"
import { useToast } from "@/hooks/use-toast"
import proxyService from "@/app/services/proxyService"

const SavingTypeFormSchema = z.object({
  name: z.string(),
  term: z.number().min(0),
  interestRate: z.number(),
})
const SavingRegulationSchema = z.object({
  minWithdrawValue: z.number(),
  savingTypes: z
    .array(SavingTypeFormSchema)
    .refine(
      (savingTypes) =>
        savingTypes.filter((type) => type.term === 0).length === 1,
      {
        message: "Need regulation for 0 term.",
      }
    )
    .refine(
      (savingTypes) => {
        const sortedSavingTypes = savingTypes.sort((a, b) => a.term - b.term)

        for (let i = 1; i < savingTypes.length; i++) {
          if (
            sortedSavingTypes[i].interestRate <=
            sortedSavingTypes[i - 1].interestRate
          ) {
            return false
          }
        }
        return true
      },
      {
        message:
          "For longer terms, the interest rate must be higher than shorter terms.",
      }
    ),

  minWithdrawDay: z.number(),
  isActive: z.boolean(),
})

type SavingRegulationFormValues = z.infer<typeof SavingRegulationSchema>
type SavingTypeFormValues = z.infer<typeof SavingTypeFormSchema>

export function CreateUpdateRegulationModal({
  data,
}: {
  data: SavingRegulation
}) {
  const regulationForm = useForm<SavingRegulationFormValues>({
    resolver: zodResolver(SavingRegulationSchema),
    defaultValues: {
      isActive: data.isActive,
      minWithdrawDay: data.minWithdrawDay,
      minWithdrawValue: data.minWithdrawValue,
      savingTypes: data.savingTypes,
    },
  })

  const { toast } = useToast()
  const [savingType, setSavingType] = useState<SavingTypeFormValues[]>(
    data.savingTypes ?? []
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    regulationForm.setValue("savingTypes", [...savingType])
    regulationForm.trigger("savingTypes")
  }, [savingType])

  const {
    formState: { errors },
  } = regulationForm

  const onAddSavingTypeBtn = () => {
    const lastSavingType = savingType[savingType.length - 1]

    setSavingType([
      ...savingType,
      {
        interestRate: lastSavingType.interestRate + 0.05,
        name: "",
        term: lastSavingType.term + 1,
      },
    ])
  }
  const onRemoveSavingTypeBtn = (id: number) => {
    setSavingType(savingType.filter((type, index) => index !== id))
  }

  useEffect(() => {
    regulationForm.reset()
    setSavingType(data.savingTypes)
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
              [field]: field === "name" ? value : parseFloat(value) || 0,
            }
          : type
      })
    )
  }

  const onRegulationFormSubmit = async (values: SavingRegulationFormValues) => {
    const res = await proxyService.put(`/regulation/${data.id}`, values)
    const content = await res.json()

    if (!res.ok) {
      const errorContent = content as ErrorResponse
      toast({
        title: "Error",
        description: errorContent.error,
        duration: 1500,
        className: "w-1/6 fixed top-8 right-16 bg-red-500 text-white",
      })
    } else {
      const respContent = content as SavingRegulation
      toast({
        title: "Sucess",
        description: "Update completely",
        duration: 1000,
        className: "w-1/4 fixed top-8 right-16 bg-green-500 text-white",
      })
      setIsOpen(false)
      console.log(respContent)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <div className="text-sm px-2 py-1 cursor-pointer">Edit</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] fixed ">
        <DialogHeader>
          <DialogTitle>Edit regulation</DialogTitle>
        </DialogHeader>

        <form onSubmit={regulationForm.handleSubmit(onRegulationFormSubmit)}>
          <div className="flex flex-row justify-between space-x-5">
            <TextInput
              control={regulationForm.control}
              name="minWithdrawValue"
              label="Min Withdraw Value"
              placeholder="Min Withdraw Value"
              className=" w-1/2"
              inline={false}
            />
            <TextInput
              control={regulationForm.control}
              name="minWithdrawDay"
              label="Min Withdraw Day"
              placeholder="Min Withdraw Day"
              className=" w-1/2"
              inline={false}
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
                    <TableRow key={`${data.id}-${index}`}>
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
            {errors.savingTypes?.message && (
              <p className="text-red-500">{errors.savingTypes.message}</p>
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
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
