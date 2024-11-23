import { combineReducers } from "@reduxjs/toolkit"

import datatableReducer from "./datatableReducer"
import toastReducer from "./toastReducer"

const rootReducers = combineReducers({
  datatableReducer,
  toastReducer
})

export default rootReducers
