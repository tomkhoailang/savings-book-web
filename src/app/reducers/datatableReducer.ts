import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  totalCount: 0,
  pagination: { current: 1, size: 25 },
  sizePerPage: [10, 25, 50, 100],
  query: "",
}

const buildQuery = (pagination: any) => {
  let query = "?"
  if (pagination) {
    query += `Skip=${(pagination.current - 1) * pagination.size}&Max=${
      pagination.size
    }`
  }
  return query
}

const datatableSlice = createSlice({
  name: "datatable",
  initialState: initialState,
  reducers: {
    updateTotalRow: (state, action) => {
      state.totalCount = action.payload
    },
    pageChange: (state, action) => {
      console.log(action);
      state.pagination = action.payload
      state.query = buildQuery(state.pagination)
    },
  },
})

export const { updateTotalRow, pageChange } = datatableSlice.actions
export default datatableSlice.reducer
