import { close, open } from "@/app/reducers/loadingReducer"
import { AppDispatch } from "@/app/reducers/store"
import { error, success } from "@/app/reducers/toastReducer"
import axios, { AxiosError } from "axios"


const excludeUrls : Record<string, boolean> = {
  "/auth/register" : true,
  "/auth/login": true,
  "/auth/reset-password": true,
  "/auth/confirm-reset-password": true,
  "/auth/change-password": true,
  "/auth/renew-access": true,
  "/auth/logout": true,
  "/saving-book/confirm-payment": true,
}
const excludeResponseUrl = [
  "/saving-book/confirm-payment",
 
  
]


export const interceptorService = (store: AppDispatch) => {
  let requestCounter = 0

  axios.interceptors.request.use(
    (cfg) => {
      requestCounter++
      const currentUrl =
        cfg.url?.replace(process.env.NEXT_PUBLIC_API_ENDPOINT || "", "") 
      if (currentUrl?.includes("/notification")) {
        return cfg
      }
      store.dispatch(open())
      return cfg
    },
    (err) => {
      store.dispatch(close())
      requestCounter--
      return Promise.reject(err)
    }
  )

  axios.interceptors.response.use(
    (response) => {
      requestCounter--
      if (!requestCounter) {
        store.dispatch(close());
      }
      

      const currentUrl =
        response.config.url?.replace(
          process.env.NEXT_PUBLIC_API_ENDPOINT || "",
          ""
        ) ?? ""

      
      const regex = /^\/notification\/.+$/
      
      if (regex.test(currentUrl)) {
        return response
      }
      
      
      if (!excludeUrls[currentUrl]) {
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
            break
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



      const currentUrl =
      err.config?.url?.replace(
        process.env.NEXT_PUBLIC_API_ENDPOINT || "",
        ""
        ) ?? ""
      

      if (excludeUrls[currentUrl]) {
        console.log("not being hit");
        return new Promise((resolve, reject) => {
          resolve(err)
        })
      }

      const { status, statusText, request } = err.response


      console.log(request);


      switch (status) {
        case 400:
          const mesasge = JSON.parse(request?.response)
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
