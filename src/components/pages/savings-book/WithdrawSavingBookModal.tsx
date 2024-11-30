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
import { WalletCards } from "lucide-react"
import { SavingBook } from "@/app/pages/savings-book/page"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { z } from "zod"
import TextInput from "@/components/common/TextInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import proxyService from "../../../../utils/proxyService"
import LoadingButton from "@/components/common/LoadingButton"
import NumberInput from "@/components/common/NumberInput"

const WithdrawSavingBookModal = ({
  savingBook,
}: {
  savingBook: SavingBook
}) => {
  const latestAppliedReg = savingBook.regulations.reduce((max, cur) => {
    return new Date(max.applyDate) > new Date(cur.applyDate) ? max : cur
  }, savingBook.regulations[0])

  const maxWithdrawValue =
    savingBook.balance > latestAppliedReg.minWithDrawValue
      ? savingBook.balance
      : latestAppliedReg.minWithDrawValue

  const WithdrawSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email can not be empty." })
      .email("This is not a valid email."),
    amount: z
      .number()
      .min(latestAppliedReg.minWithDrawValue)
      .max(maxWithdrawValue),
  })

  type WithdrawFormValues = z.infer<typeof WithdrawSchema>

  const withdrawForm = useForm<WithdrawFormValues>({
    resolver: zodResolver(WithdrawSchema),
    defaultValues: {
      email: "",
      amount: latestAppliedReg.minWithDrawValue,
    },
  })

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: WithdrawFormValues) => {
    console.log("trigger")
    setIsLoading(true)
    const res = await proxyService.post(
      `/saving-book/${savingBook.id}/withdraw-online `,
      data
    )
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
          <Button variant="outline">
            {" "}
            <WalletCards /> <span>Withdraw now</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw</DialogTitle>
            <DialogDescription>
              The value couldn't not exceed
              <span className="font-bold"> {savingBook.balance}$ </span>
              which is your current balance
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...withdrawForm}>
            <form onSubmit={withdrawForm.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="flex flex-row items-center justify-center space-x-4">
                  <Label htmlFor="name" className="text-left w-1/6">
                    Email
                  </Label>
                  <TextInput
                    control={withdrawForm.control}
                    className="w-full"
                    name="email"
                    placeholder="Your paypal email"
                  />
                </div>
                <div className="flex flex-row items-center justify-center space-x-4">
                  <Label htmlFor="username" className="text-left  w-1/6">
                    Amount
                  </Label>
                  <NumberInput
                    control={withdrawForm.control}
                    className="w-full"
                    name="amount"
                    decimalPoint={2}
                    min={latestAppliedReg.minWithDrawValue}
                    max={maxWithdrawValue}
                    step={0.01}
                  />
                </div>
              </div>
              <DialogFooter>
                <LoadingButton
                  isLoading={isLoading}
                  loadingText="Loading"
                  label="Withdraw"
                  onclick={() => {
                    console.log(
                      "check this method again",
                      withdrawForm.getValues(),
                      withdrawForm.formState.errors
                    )
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

export default WithdrawSavingBookModal
