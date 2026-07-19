import { useEffect } from "react";
import { useAppStore } from "../stores/useAppStore";

const MAX_RECONNECT_DELAY = 30_000;

export function useWebSocket() {
  const setConnectionStatus = useAppStore((state) => state.setConnectionStatus);
  const incrementNotifications = useAppStore((state) => state.incrementNotifications);

  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_WEBSOCKET_URL;
    if (!url) {
      setConnectionStatus("disabled");
      return;
    }

    let socket: WebSocket | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let delay = 1_000;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      setConnectionStatus(delay === 1_000 ? "connecting" : "reconnecting");
      socket = new WebSocket(url);
      socket.onopen = () => {
        delay = 1_000;
        setConnectionStatus("connected");
      };
      socket.onmessage = () => incrementNotifications();
      socket.onerror = () => socket?.close();
      socket.onclose = () => {
        if (disposed) return;
        setConnectionStatus("reconnecting");
        timer = setTimeout(connect, delay);
        delay = Math.min(delay * 2, MAX_RECONNECT_DELAY);
      };
    };

    connect();
    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      socket?.close();
    };
  }, [incrementNotifications, setConnectionStatus]);
}
