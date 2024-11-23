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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useRouter } from "next/navigation"

const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters" })
      .max(20, {
        message: "Username must be less or equal than 20 characters",
      }),
    email: z
      .string()
      .min(1, { message: "Email can't be empty" })
      .email("Email is not valid"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(20, { message: "Password must be less or equal than 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password doesn't match the provided password",
  })

const sendResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email can't be empty" })
    .email("Email is not valid"),
})

const loginFormSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters" })
    .max(20, {
      message: "Username must be less or equal than 20 characters",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, {
      message: "Password must be less or equal than 20 characters",
    }),
  rememberPassword: z.boolean().default(false),
})

type RegisterFormValues = z.infer<typeof registerFormSchema>
type LoginFormValues = z.infer<typeof loginFormSchema>
type SendResetPasswordValues = z.infer<typeof sendResetPasswordSchema>

const Login = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [isReset, setIsReset] = useState(false)
  const { toast } = useToast()
  const authContext = useAuth()

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  })
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberPassword: false,
    },
  })
  const resetPasswordForm = useForm<SendResetPasswordValues>({
    resolver: zodResolver(sendResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })
  const onResetPasswordForm = async (values: SendResetPasswordValues) => {
    setLoading(true)

    const res = await proxyService.post("/auth/reset-password", values)
    const content: ErrorResponse = res.data

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
        title: "Success",
        variant: "default",
        description: "An email is sent to your register mail",
        duration: 1500,
        className:
          "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
      })
      registerForm.reset()
    }
    setLoading(false)
  }

  const onRegisterFormSubmit = async (values: RegisterFormValues) => {
    setLoading(true)

    const res = await proxyService.post("/auth/register", values)
    const content: ErrorResponse = res.data

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
        title: "Sign up complete",
        variant: "default",
        description: "Your account is created successfully",
        duration: 1500,
        className:
          "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
      })
      setActiveTab("login")
      registerForm.reset()
      loginForm.reset()
      loginForm.setValue("username", values.username)
    }
    setLoading(false)
  }
  const onLoginFormSubmit = async (values: LoginFormValues) => {
    setLoading(true)

    const res = await proxyService.post("/auth/login", values)
    const content = await res.data

    if (res.status >= 400) {
      const errorContent = content as ErrorResponse
      toast({
        title: "Error",
        variant: "destructive",
        description: errorContent.error,
        duration: 1500,
        className: "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4",
      })
    } else {
      const loginContent = content as LoginResponse
      toast({
        title: "Login successfully",
        description: "Your will be redirect to dashboard soon",
        duration: 1500,
        className: "w-1/4 fixed top-8 right-16 bg-green-500 text-white",
      })
      authContext?.login(loginContent.access_token, loginContent.refresh_token)
      router.push("/pages/dashboard")
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
        {!isReset ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-[275px] mt-2"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="w-full border-2 rounded-lg mt-3">
                <CardContent className="space-y-2 p-0 m-4">
                  <form onSubmit={loginForm.handleSubmit(onLoginFormSubmit)}>
                    <div className="space-y-1">
                      <TextInput
                        control={loginForm.control}
                        name="username"
                        label="Username/Email"
                        placeholder="Username/Email"
                        className="mb-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <TextInput
                        control={loginForm.control}
                        name="password"
                        label="Password"
                        placeholder="Password"
                        className="mb-2"
                        password
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Controller
                        control={loginForm.control}
                        name="rememberPassword"
                        render={({ field, fieldState }) => {
                          return (
                            <Checkbox
                              id="rememberPassword"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            ></Checkbox>
                          )
                        }}
                      />
                      <Label htmlFor="terms">Remember password</Label>
                    </div>
                    <div
                      className="mt-2 text-sm text-gray-400 hover:text-blue-400 cursor-pointer"
                      onClick={() => {
                        setIsReset(true)
                      }}
                    >
                      Forgot your password?
                    </div>
                    <div className="flex justify-end">
                      <LoadingButton
                        isLoading={loading}
                        label="Login"
                      ></LoadingButton>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent
              value="register"
              className="border-2 rounded-lg shadow-md "
            >
              <ScrollArea className="h-[325px]  ">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterFormSubmit)}
                  >
                    <div className="m-4">
                      <div className="space-y-1">
                        <TextInput
                          control={registerForm.control}
                          name="username"
                          label="Username"
                          placeholder="Username"
                          className="mb-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <TextInput
                          control={registerForm.control}
                          name="email"
                          label="Email"
                          placeholder="Email"
                          className="mb-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <TextInput
                          control={registerForm.control}
                          name="password"
                          label="Password"
                          placeholder="Password"
                          className="mb-2"
                          password
                        />
                      </div>
                      <div className="space-y-1">
                        <TextInput
                          control={registerForm.control}
                          name="confirmPassword"
                          label="Confirm password"
                          placeholder="Confirm password"
                          className="mb-2"
                          password
                        />
                      </div>
                      <div className="flex justify-end">
                        <LoadingButton
                          isLoading={loading}
                          label="Register"
                        ></LoadingButton>
                      </div>
                    </div>
                  </form>
                </Form>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="w-full border-2 rounded-lg mt-3">
            <CardContent className="space-y-2 p-0 m-4">
              <form
                onSubmit={resetPasswordForm.handleSubmit(onResetPasswordForm)}
              >
                <div className="space-y-1">
                  <TextInput
                    control={resetPasswordForm.control}
                    name="email"
                    label="Email"
                    placeholder="Email"
                    className="mb-2"
                  />
                </div>

                <div
                  className="mt-2 text-sm text-gray-400 hover:text-blue-400 cursor-pointer"
                  onClick={() => {
                    setIsReset(false)
                  }}
                >
                  Login?
                </div>
                <div className="flex justify-end">
                  <LoadingButton
                    isLoading={loading}
                    label="Send email"
                  ></LoadingButton>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </Card>
    </div>
  )
}
Login.getLayout = function getLayout(page: React.ReactElement) {
  return { page }
}

export default Login
