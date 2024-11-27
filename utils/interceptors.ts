import { close, open } from "@/app/reducers/loadingReducer"
import { AppDispatch } from "@/app/reducers/store"
import { error, success } from "@/app/reducers/toastReducer"
import axios, { AxiosError } from "axios"

const excludeUrls = [
  "/auth/register",
  "/auth/login",
  "/auth/reset-password",
  "/auth/confirm-reset-password",
  "/auth/change-password",
  "/auth/renew-access",
  "/auth/logout",
  
]

export const interceptorService = (store: AppDispatch) => {
  let requestCounter = 0

  axios.interceptors.request.use(
    (cfg) => {
      const currentUrl =
        cfg.url?.replace(process.env.NEXT_PUBLIC_API_ENDPOINT || "", "") 
      if (currentUrl?.includes("/notification")) {
        return cfg
      }
      requestCounter++
      store.dispatch(open())
      return cfg
    },
    (err) => {
      store.dispatch(close())
      return Promise.reject(err)
    }
  )

  axios.interceptors.response.use(
    (response) => {
      requestCounter--
      store.dispatch(close())

      const currentUrl =
        response.config.url?.replace(
          process.env.NEXT_PUBLIC_API_ENDPOINT || "",
          ""
        ) ?? ""

      if (!excludeUrls.includes(currentUrl)) {
        switch (response.config.method) {
          case "put":
            store.dispatch(
              success({
                variant: "success",
                title: "Update successfully",
                message: "Your changes have been saved",
                description: "",
              })
            )
            break
          case "post":
            store.dispatch(
              success({
                variant: "success",
                title: "Create successfully",
                message: "Your changes have been saved",
                description: "",
              })
            )
          case "delete":
            store.dispatch(
              success({
                variant: "success",
                title: "Delete successfully",
                message: "Your changes have been saved",
                description: "",
              })
            )
            break
          default:
            break
        }
      }
      return response
    },
    (err: AxiosError) => {
      requestCounter--
      store.dispatch(close())

      if (!err.response) {
        return new Promise((resolve, reject) => {
          store.dispatch(
            error({
              variant: "destructive",
              title: "Something really bad happen",
              message: "Check this out",
              description: "",
            })
          )
          resolve(err)
        })
      }

      const { status, statusText, request } = err.response


      const mesasge = JSON.parse(request.response)

      switch (status) {
        case 400:
          return new Promise((resolve, reject) => {
            store.dispatch(
              error({
                variant: "destructive",
                title: "Bad request",
                message: mesasge.error ?? `${mesasge[0]?.message + mesasge[0]?.field}`,
                description: "",
              })
            )
            resolve(err)
          })
        case 401:
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("currentUser")
          return new Promise((resolve, reject) => {
            store.dispatch(
              error({
                variant: "destructive",
                title: "Unauthorized",
                message:
                  "You don't have enough permission to perform this action",
                description: "",
              })
            )
            resolve(err)
          })

        default:
          return new Promise((resolve, reject) => {
            store.dispatch(
              error({
                variant: "destructive",
                title: "Something went wrong",
                message: "There are one or more errors from server",
                description: "",
              })
            )
            resolve(err)
          })
      }
    }
  )
}
