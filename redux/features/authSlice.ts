
import { IUser } from '@/types';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


type TInitialStateType = {
  isLoading:boolean;
    isAuthenticated: boolean;
    user: IUser | null;
}

const initialState:TInitialStateType  = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser:(state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    logoutUser:() =>  initialState,
 
    setLoading:(state , action: PayloadAction<boolean>) => {
      state.isLoading = action?.payload
      
    },
   
  },
})

// Action creators are generated for each case reducer function
export const { setAuthUser,logoutUser,setLoading } = authSlice.actions
export default authSlice.reducer