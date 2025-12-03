// src/lib/store.ts
import { create } from "zustand";

type UIState = {
  drawerOpen: boolean;
  setDrawer: (open: boolean) => void;
  toggleDrawer: () => void;
};

export const useUI = create<UIState>((set) => ({
  drawerOpen: false,
  setDrawer: (open) => set({ drawerOpen: open }),
  toggleDrawer: () =>
    set((state) => ({
      drawerOpen: !state.drawerOpen,
    })),
}));
