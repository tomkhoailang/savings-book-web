import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  key: 0,
  duration: 1500,
  isShow: false,
  variant: null,
  title: "",
  description: "",
  message: ""
}

const ToastSlice = createSlice({
  name: "toast",
  initialState: initialState,
  reducers: {
    error: (state, action) => {
      state.key++
      state.isShow = true
      state.variant = action.payload.variant
      state.title = action.payload.title
      state.message = action.payload.message
      state.description = action.payload.description

    },
    success: (state, action) => {
      state.key++
      state.isShow = true
      state.variant = action.payload.variant
      state.title = action.payload.title
      state.message = action.payload.message
      state.description = action.payload.description

    },
    info: (state, action) => {
      state.key++
      state.isShow = true
      state.variant = action.payload.variant
      state.title = action.payload.title
      state.message = action.payload.message
      state.description = action.payload.description
    },
    hide: (state, action) => {
      state.isShow = false
    }

  }

})
export const { error, success, info, hide } = ToastSlice.actions
export default ToastSlice.reducer