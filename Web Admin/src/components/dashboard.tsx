"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Activity, Bell, HeartPulse, Radio, UserRoundPlus, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { patientSchema, type PatientInput } from "@/lib/patient-schema";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import {
  type ConnectionStatus,
  useRealtimeStore,
} from "@/stores/use-realtime-store";

const visits = [
  { day: "T2", total: 42 },
  { day: "T3", total: 58 },
  { day: "T4", total: 49 },
  { day: "T5", total: 74 },
  { day: "T6", total: 63 },
  { day: "T7", total: 81 },
];

export function Dashboard() {
  const registeredPatients = useDashboardStore(
    (state) => state.registeredPatients,
  );
  const addPatient = useDashboardStore((state) => state.addPatient);
  const realtimeStatus = useRealtimeStore((state) => state.status);
  const notifications = useRealtimeStore((state) => state.notifications);
  const { data: systemStatus = "Đang kiểm tra…" } = useQuery({
    queryKey: ["system-status"],
    queryFn: async () => "Tất cả hệ thống hoạt động ổn định",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientInput>({ resolver: zodResolver(patientSchema) });

  const onSubmit = () => {
    addPatient();
    reset();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-700">
              OMNI HEALTH
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Tổng quan vận hành
            </h1>
          </div>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Activity className="size-4 text-emerald-600" /> {systemStatus}
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Stat icon={Users} label="Bệnh nhân" value={registeredPatients} />
          <Stat icon={HeartPulse} label="Lượt khám hôm nay" value={81} />
          <Stat icon={Activity} label="Kênh đang kết nối" value={6} />
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Radio className="size-5 text-emerald-600" />
            <div>
              <h2 className="font-semibold">WebSocket Client</h2>
              <p className="text-sm text-slate-500">
                Queue và notification real-time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className={`size-2 rounded-full ${statusColor[realtimeStatus]}`} />
              {statusLabel[realtimeStatus]}
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Bell className="size-4" /> {notifications.length}
            </span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 font-semibold">Lượt khám trong tuần</h2>
            <div className="h-72" aria-label="Biểu đồ lượt khám trong tuần">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#059669"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <form
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-5 flex items-center gap-2">
              <UserRoundPlus className="size-5 text-emerald-600" />
              <h2 className="font-semibold">Thêm bệnh nhân</h2>
            </div>
            <label className="mb-4 block text-sm font-medium">
              Họ và tên
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
                placeholder="Nguyễn Văn An"
                {...register("name")}
              />
              {errors.name && (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.name.message}
                </span>
              )}
            </label>
            <label className="mb-5 block text-sm font-medium">
              Email
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
                placeholder="an@example.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.email.message}
                </span>
              )}
            </label>
            <button className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-medium text-white hover:bg-emerald-800">
              Tạo hồ sơ
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

const statusLabel: Record<ConnectionStatus, string> = {
  disabled: "Chờ cấu hình URL",
  connecting: "Đang kết nối",
  connected: "Đã kết nối",
  reconnecting: "Đang kết nối lại",
  disconnected: "Đã ngắt kết nối",
};

const statusColor: Record<ConnectionStatus, string> = {
  disabled: "bg-amber-500",
  connecting: "bg-sky-500",
  connected: "bg-emerald-500",
  reconnecting: "bg-orange-500",
  disconnected: "bg-slate-400",
};

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="mb-4 size-5 text-emerald-600" />
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value.toLocaleString("vi-VN")}</p>
    </article>
  );
}
