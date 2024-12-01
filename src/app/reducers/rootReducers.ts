import { combineReducers } from "@reduxjs/toolkit"

import datatableReducer from "./datatableReducer"
import toastReducer from "./toastReducer"
import loadingReducer from "./loadingReducer"
import socketReducer from "./socketReducer"

const rootReducers = combineReducers({
  datatableReducer,
  toastReducer,
  loadingReducer,
  socketReducer
})

export default rootReducers
