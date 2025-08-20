
import { create } from 'zustand'

type UIState = {
  drawerOpen: boolean
  setDrawer: (v: boolean) => void
  lang: 'en'|'sr'
  setLang: (l: 'en'|'sr') => void
}

export const useUI = create<UIState>((set) => ({
  drawerOpen: false,
  setDrawer: (v) => set({ drawerOpen: v }),
  lang: 'en',
  setLang: (l) => set({ lang: l })
}))
