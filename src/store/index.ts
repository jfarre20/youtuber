import { configureStore } from '@reduxjs/toolkit'
import uiSlice from '@/store/slices/uiSlice'
import userSlice from '@/store/slices/userSlice'
import projectSlice from '@/store/slices/projectSlice'
import clipSlice from '@/store/slices/clipSlice'
import editorSlice from '@/store/slices/editorSlice'

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    user: userSlice,
    project: projectSlice,
    clip: clipSlice,
    editor: editorSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
