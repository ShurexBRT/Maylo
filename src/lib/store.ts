import { create } from 'zustand'

type UIState = {
  drawerOpen: boolean
  setDrawer: (open: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  drawerOpen: false,                 // <-- default false
  setDrawer: (open) => set({ drawerOpen: open }),
}))
