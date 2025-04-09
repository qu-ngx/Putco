import { store } from './index'

declare type RootState = ReturnType<typeof store.getState>
declare type AppDispatch = typeof store.dispatch

export { RootState, AppDispatch }