"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Controller, useForm } from "react-hook-form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Form } from "@/components/ui/form"
import TextInput from "@/components/common/InputText"
import { log } from "console"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import proxyService from "../../../../utils/proxyService"
import { useState } from "react"
import LoadingButton from "@/components/common/LoadingButton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/contexts/authContext"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const confirmResetPasswordSchema = z
  .object({
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password doesn't match the provided password",
  })

type ConfirmResetPasswordValues = z.infer<typeof confirmResetPasswordSchema>

const ResetPassword = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const authContext = useAuth()
  const searchParams = useSearchParams()

  const resetPasswordForm = useForm<ConfirmResetPasswordValues>({
    resolver: zodResolver(confirmResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onResetPasswordFormSubmit = async (
    values: ConfirmResetPasswordValues
  ) => {
    setLoading(true)

    const res = await proxyService.post(
      `/auth/confirm-reset-password?token=${searchParams.get("token")}`,
      values
    )
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
        title: "Reset password complete",
        variant: "default",
        description: "Your password is reset",
        duration: 1500,
        className:
          "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
      })
      router.push("/login")
    }
    setLoading(false)
  }

  return (
    <div className=" flex items-center justify-center min-h-screen space-y-5">
      <Card className="w-[325px] p-5 flex items-center justify-center flex-col">
        <Image
          src={"/images/thumb-1920-1195358.jpg"}
          alt="test"
          width={275}
          height={275}
          className="rounded-lg "
        />

        <Card className="w-full border-2 rounded-lg mt-3 ">
          <CardTitle className="ml-4 mt-4">Reset password</CardTitle>
          <CardDescription className="ml-4 mt-1">
            You can change the password here
          </CardDescription>
          <CardContent className="space-y-2 p-0 m-4">
            <form
              onSubmit={resetPasswordForm.handleSubmit(
                onResetPasswordFormSubmit
              )}
            >
              <div className="">
                <div className="space-y-1">
                  <TextInput
                    control={resetPasswordForm.control}
                    name="password"
                    label="Password"
                    placeholder="Password"
                    className="mb-2"
                    password
                  />
                </div>
                <div className="space-y-1">
                  <TextInput
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="Confirm password"
                    className="mb-2"
                    password
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <LoadingButton
                  isLoading={loading}
                  label="Reset password"
                ></LoadingButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </Card>
    </div>
  )
}
ResetPassword.getLayout = function getLayout(page: React.ReactElement) {
  return { page }
}

export default ResetPassword
