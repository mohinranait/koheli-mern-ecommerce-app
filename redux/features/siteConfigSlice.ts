
import { defaultSiteSettings, SiteSettings } from '@/lib/site-settings';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


type TInitialStateType = {
  site: SiteSettings;
}

const initialState:TInitialStateType  = {
  site: {...defaultSiteSettings},
}

export const siteConfigSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setSiteConfig:(state, action: PayloadAction<SiteSettings>) => {
        state.site = action.payload;
    },  
   
  },
})

// Action creators are generated for each case reducer function
export const { setSiteConfig } = siteConfigSlice.actions
export default siteConfigSlice.reducer