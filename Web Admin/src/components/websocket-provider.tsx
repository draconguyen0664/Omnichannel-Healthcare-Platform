"use client";

import { useEffect } from "react";
import { parseRealtimeMessage } from "@/lib/realtime-message";
import { useRealtimeStore } from "@/stores/use-realtime-store";

const INITIAL_RECONNECT_DELAY = 1_000;
const MAX_RECONNECT_DELAY = 30_000;

export function WebSocketProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const setStatus = useRealtimeStore((state) => state.setStatus);
  const addNotification = useRealtimeStore((state) => state.addNotification);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

    if (!url) {
      setStatus("disabled");
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectDelay = INITIAL_RECONNECT_DELAY;
    let disposed = false;

    const connect = () => {
      if (disposed) return;

      setStatus(reconnectDelay > INITIAL_RECONNECT_DELAY ? "reconnecting" : "connecting");
      socket = new WebSocket(url);

      socket.addEventListener("open", () => {
        reconnectDelay = INITIAL_RECONNECT_DELAY;
        setStatus("connected");
      });

      socket.addEventListener("message", (event) => {
        const message = parseRealtimeMessage(event.data);
        if (!message) return;

        addNotification({
          id: message.id ?? crypto.randomUUID(),
          title: message.title ?? "Thông báo mới",
          message: message.message,
          receivedAt: new Date().toISOString(),
        });
      });

      socket.addEventListener("close", () => {
        if (disposed) return;

        setStatus("reconnecting");
        reconnectTimer = setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
      });

      socket.addEventListener("error", () => socket?.close());
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
      setStatus("disconnected");
    };
  }, [addNotification, setStatus]);

  return children;
}
