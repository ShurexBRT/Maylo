import { create } from "zustand";

type UIState = {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setDrawer: (open: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  drawerOpen: false,

  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setDrawer: (open) => set({ drawerOpen: open }),
}));
