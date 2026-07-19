import { create } from "zustand";

export type ConnectionStatus =
  | "disabled"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export type RealtimeNotification = {
  id: string;
  title: string;
  message: string;
  receivedAt: string;
};

type RealtimeState = {
  status: ConnectionStatus;
  notifications: RealtimeNotification[];
  setStatus: (status: ConnectionStatus) => void;
  addNotification: (notification: RealtimeNotification) => void;
  clearNotifications: () => void;
};

export const useRealtimeStore = create<RealtimeState>((set) => ({
  status: "disabled",
  notifications: [],
  setStatus: (status) => set({ status }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
