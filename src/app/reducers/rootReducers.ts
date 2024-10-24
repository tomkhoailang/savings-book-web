import { combineReducers } from "@reduxjs/toolkit"

import datatableReducer from "./datatableReducer"

const rootReducers = combineReducers({
  datatableReducer,
})

export default rootReducers
