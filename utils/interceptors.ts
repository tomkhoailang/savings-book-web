import { close, open } from "@/app/reducers/loadingReducer"
import { AppDispatch } from "@/app/reducers/store"
import { error, success } from "@/app/reducers/toastReducer"
import axios from "axios"

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
      if (!requestCounter) {
        store.dispatch(close())
      }

      const currentUrl = response.config.url?.replace(
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
    (err) => {
      requestCounter--
      if (!requestCounter) store.dispatch(close())

      store.dispatch(
        error({
          variant: "destructive",
          title: "Something went wrong",
          message: "There are one or more errors from server",
          description: "",
        })
      )

      return Promise.reject(err)
    }
  )
}
