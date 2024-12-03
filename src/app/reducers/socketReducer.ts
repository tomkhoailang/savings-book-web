import {createSlice} from "@reduxjs/toolkit"



export interface SocketMessage {
  type: string,
  data: any
}


const initialState: SocketMessage = {
  type: "",
  data: {}
}

const socketSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      state.type = action.payload.type
      state.data = action.payload.data;
    },
    resetData: (state, action) => {
      state.data = {};
    },
  },
})

export const { setData, resetData } = socketSlice.actions
export default socketSlice.reducer
