// src/lib/store.ts
import { create } from "zustand";

type UIState = {
  drawerOpen: boolean;
  setDrawer: (open: boolean) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
};

export const useUI = create<UIState>((set) => ({
  drawerOpen: false,
  setDrawer: (open: boolean) => set({ drawerOpen: open }),
  toggleDrawer: () =>
    set((state: UIState) => ({
      drawerOpen: !state.drawerOpen,
    })),

  closeDrawer: () => set({ drawerOpen: false }),
}));
