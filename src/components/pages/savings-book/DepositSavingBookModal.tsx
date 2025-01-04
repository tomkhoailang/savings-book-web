import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BookDown, WalletCards } from "lucide-react"
import { SavingBook } from "@/app/pages/savings-book/page"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { z } from "zod"
import TextInput from "@/components/common/TextInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import proxyService from "../../../../utils/proxyService"
import LoadingButton from "@/components/common/LoadingButton"
import NumberInput from "@/components/common/NumberInput"
import DropdownControl from "@/components/common/DropdownControl"
import { SavingRegulation } from "@/app/pages/regulations/page"

const DepositSavingBookModal = ({ savingBook }: { savingBook: SavingBook }) => {
  const latestAppliedReg = savingBook.regulations.reduce((max, cur) => {
    return new Date(max.applyDate) > new Date(cur.applyDate) ? max : cur
  }, savingBook.regulations[0])

  const maxWithdrawValue =
    savingBook.balance > latestAppliedReg.minWithDrawValue ? savingBook.balance : latestAppliedReg.minWithDrawValue

  const DepositSchema = z.object({
    term: z.number(),
    amount: z.number().min(latestAppliedReg.minWithDrawValue),
  })

  type DepositFormValues = z.infer<typeof DepositSchema>

  const depositForm = useForm<DepositFormValues>({
    resolver: zodResolver(DepositSchema),
    defaultValues: {
      term: 0,
      amount: latestAppliedReg.minWithDrawValue,
    },
  })

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      label:
        item.term === 0
          ? `Demand deposit - ${item.interestRate}%`
          : `Term: ${item.term} months - ${item.interestRate}%`,
    }
  })

  const onSubmit = async (data: DepositFormValues) => {
    console.log("trigger", data)
    setIsLoading(true)
    const res = await proxyService.post(`/saving-book/${savingBook.id}/deposit-online `, data)
    const content = res.data
    if (res.status === 200 || res.status === 201) {
      setOpen(false)
    } else {
    }
    setIsLoading(false)
  }

  return (
    <div className="flex justify-center space-x-2 text-center cursor-pointer text-green-500">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" style={{width:"100px"}}>
            {" "}
            <BookDown /> <span>Deposit</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit</DialogTitle>
            <DialogDescription>
              Current balance:
              <span className="font-bold"> {Math.floor(savingBook.balance * 100) / 100}$ </span>
              <br />
              The minimum value for withdraw is{" "}
              <span className="font-bold"> {latestAppliedReg.minWithDrawValue}$ </span>
              <br />
              The minimum day to withdraw is <span className="font-bold"> {latestAppliedReg.minWithDrawDay}</span>
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...depositForm}>
            <form onSubmit={depositForm.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="flex flex-row items-center justify-center space-x-4">
                  <NumberInput
                    control={depositForm.control}
                    label="Amount"
                    className="w-full"
                    name="amount"
                    decimalPoint={2}
                    min={latestAppliedReg.minWithDrawValue}
                    step={0.01}
                  />
                </div>
                <div className="flex flex-row justify-between space-x-5">
                  <div className="w-full">
                    <DropdownControl
                      control={depositForm.control}
                      label="Regulation"
                      datasource={latestRegulationMap}
                      name="term"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <LoadingButton
                  isLoading={isLoading}
                  loadingText="Loading"
                  label="Deposit"
                  onclick={() => {
                    console.log("check this method again", depositForm.getValues(), depositForm.formState.errors)
                  }}
                />
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DepositSavingBookModal
