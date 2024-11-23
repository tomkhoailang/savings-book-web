import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  isLoading: false
}

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialState,
  reducers: {
    open: (state, action) => {
      state.isLoading = true
    },
    close: (state, action) => {
      state.isLoading = false
    }
  },
})

export const { open, close } = loadingSlice.actions
export default loadingSlice.reducer
