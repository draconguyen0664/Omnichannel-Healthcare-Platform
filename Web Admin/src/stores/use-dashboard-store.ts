import { create } from "zustand";

type DashboardState = {
  registeredPatients: number;
  addPatient: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  registeredPatients: 1248,
  addPatient: () =>
    set((state) => ({ registeredPatients: state.registeredPatients + 1 })),
}));
