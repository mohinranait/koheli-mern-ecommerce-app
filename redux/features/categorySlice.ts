import { ICategory } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface categoryState {
  categories: ICategory[]
}

// Define the initial state using that type
const initialState: categoryState = {
  categories: [],
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories  = action.payload;
    },
  },
})

export const { setCategories } = categorySlice.actions



export default categorySlice.reducer