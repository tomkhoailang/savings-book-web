import { configureStore } from "@reduxjs/toolkit"
import rootReducers from "./rootReducers"
import { interceptorService } from "../../../utils/interceptors"

let store: any

const defaultStore = configureStore({
  reducer: rootReducers,
})


export const initializeStore = () => {
  if (typeof window === "undefined") {
    return defaultStore
  }

  if (!store) {
    store = defaultStore
    interceptorService(store)
  }
  return defaultStore

}


export type RootState = ReturnType<typeof defaultStore.getState>
export type AppDispatch = typeof defaultStore



