"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Controller, useForm } from "react-hook-form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Form } from "@/components/ui/form"
import TextInput from "@/components/common/TextInput"
import { log } from "console"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import proxyService from "../../../../utils/proxyService"
import { Fragment, useState } from "react"
import LoadingButton from "@/components/common/LoadingButton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/contexts/authContext"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DataTablePopup } from "@/components/common/datatable/DatatablePopup"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Pen } from "lucide-react"
import { SidebarMenuItem } from "@/components/ui/sidebar"

const confirmChangePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(20, { message: "Password must be less or equal than 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(20, { message: "Password must be less or equal than 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password doesn't match the provided password",
  })

type ConfirmChangePasswordValues = z.infer<typeof confirmChangePasswordSchema>

const ChangePassword = ({ open, setOpen }: { open: any; setOpen: any }) => {
  // const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const authContext = useAuth()
  const searchParams = useSearchParams()

  const changePasswordForm = useForm<ConfirmChangePasswordValues>({
    resolver: zodResolver(confirmChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  })

  const onResetPasswordFormSubmit = async (values: ConfirmChangePasswordValues) => {
    setLoading(true)

    const res = await proxyService.post(`/auth/change-password?token=${searchParams.get("token")}`, values)
    console.log(res)
    const content: ErrorResponse = res.data
    console.log(content)

    if (res.status >= 400) {
      toast({
        title: "Error",
        variant: "destructive",
        description: content.error,
        duration: 1500,
        className: "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4",
      })
    } else {
      toast({
        title: "Change password complete",
        variant: "default",
        description: "Your password is changed",
        duration: 1500,
        className: "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
      })
      // router.push("/login")
    }
    setLoading(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}>
      <DialogContent >
        <div >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Change Password</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Please enter your new password below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={changePasswordForm.handleSubmit(onResetPasswordFormSubmit)}>
            <div className="">
              <div className="space-y-1">
                <TextInput
                  control={changePasswordForm.control}
                  name="oldPassword"
                  label="Current Password"
                  placeholder="Current Password"
                  className="mb-2"
                  password
                />
              </div>
              <div className="space-y-1">
                <TextInput
                  control={changePasswordForm.control}
                  name="newPassword"
                  label="New Password"
                  placeholder="New Password"
                  className="mb-2"
                  password
                />
              </div>
              <div className="space-y-1">
                <TextInput
                  control={changePasswordForm.control}
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="Confirm password"
                  className="mb-2"
                  password
                />
              </div>
            </div>
            <div className="flex justify-end">
              <LoadingButton isLoading={loading} label="Change password"></LoadingButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePassword
