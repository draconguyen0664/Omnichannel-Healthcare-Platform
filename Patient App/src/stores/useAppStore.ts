import { create } from "zustand";

type ConnectionStatus = "disabled" | "connecting" | "connected" | "reconnecting";

type AppState = {
  connectionStatus: ConnectionStatus;
  notificationCount: number;
  setConnectionStatus: (status: ConnectionStatus) => void;
  incrementNotifications: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  connectionStatus: "disabled",
  notificationCount: 0,
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  incrementNotifications: () =>
    set((state) => ({ notificationCount: state.notificationCount + 1 })),
}));
