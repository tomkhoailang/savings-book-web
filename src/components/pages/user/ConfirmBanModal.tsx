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
import { BookDown, Shield, ShieldBan, WalletCards } from "lucide-react"
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
import { User } from "@/app/pages/user-manager/users/page"

const ConfirmBanModal = ({ user: user }: { user: User }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    setIsLoading(true)
    const res = await proxyService.put(`/user/disable/${user.id}`, {})
    if (res.status === 200 || res.status === 201) {
      setOpen(false)
      user.isActive = !user.isActive
    }
    setIsLoading(false)
  }

  return (
    <div className="flex justify-center space-x-2 text-center cursor-pointer text-green-500">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {user.isActive ? (
            <ShieldBan className="cursor-pointer rounded-md border-2" size={28} onClick={() => setOpen(true)} />
          ) : (
            <Shield className="cursor-pointer rounded-md border-2" size={28} onClick={() => setOpen(true)} />
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] fixed top-20 mt-20">
          <DialogHeader>
            <DialogTitle>Change authorization</DialogTitle>
            <DialogDescription>Are you sure you want to {user.isActive ? "ban" : "unban"} this user?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <LoadingButton
              isLoading={isLoading}
              loadingText="Loading"
              label="Confirm"
              onclick={() => {
                onSubmit()
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConfirmBanModal
