import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  productReducer  from './features/productSlice'
import  categoryReducer  from './features/categorySlice'
import  authReducer  from './features/authSlice'
import  siteConfigReducer  from './features/siteConfigSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

const persistAuth = {
    key: 'auth',
    storage,
}

const persistedAuthReducer = persistReducer(persistAuth, authReducer)

const rootReducer = combineReducers({
    product: productReducer,
    category: categoryReducer,
    auth: persistedAuthReducer,
    site: siteConfigReducer,
})


export const store = configureStore({
  reducer: rootReducer,
})


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

