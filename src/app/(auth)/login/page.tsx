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
import TextInput from "@/components/custom/InputText"
import { log } from "console"

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
      .min(6, { message: "Password must be at least 3 characters" })
      .max(20, { message: "Password must be less or equal than 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 3 characters" })
      .max(20, { message: "Password must be less or equal than 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message: "Password must contain at least one special character",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password doesn't match the provided password",
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
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[@$!%*?&#]/, {
      message: "Password must contain at least one special character",
    }),
  rememberPassword: z.boolean().default(false),
})

type RegisterFormValues = z.infer<typeof registerFormSchema>
type LoginFormValues = z.infer<typeof loginFormSchema>

const Login = () => {
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
  const onRegisterFormSubmit = (values: RegisterFormValues) => {
    console.log("test register")
    console.log(values)
  }
  const onLoginFormSubmit = (values: LoginFormValues) => {
    console.log("check login")
    console.log(values)
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
        <Tabs defaultValue="login" className="w-[275px] mt-2">
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
                      label="Username"
                      placeholder="Username"
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
                    <Label htmlFor="terms">Remember password?</Label>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="mt-2">
                      Login to your account
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="register"
            className="border-2 rounded-lg shadow-md "
          >
            <ScrollArea className="h-[250px]  ">
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
                      <Button type="submit" className="mt-2">
                        Register
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
Login.getLayout = function getLayout(page: React.ReactElement) {
  return { page }
}

export default Login
