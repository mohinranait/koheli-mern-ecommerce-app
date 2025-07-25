import { IProduct } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface ProductState {
  products: IProduct[]
}

// Define the initial state using that type
const initialState: ProductState = {
  products: [],
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products  = action.payload;
    },
  },
})

export const { setProducts } = productSlice.actions



export default productSlice.reducer