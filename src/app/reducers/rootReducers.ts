import { combineReducers } from "@reduxjs/toolkit"

import datatableReducer from "./datatableReducer"
import toastReducer from "./toastReducer"
import loadingReducer from "./loadingReducer"

const rootReducers = combineReducers({
  datatableReducer,
  toastReducer,
  loadingReducer
})

export default rootReducers
