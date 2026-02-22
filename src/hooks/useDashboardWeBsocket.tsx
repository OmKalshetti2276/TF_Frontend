import { useState, useEffect, useRef } from "react";

export const useDashboardWebSocket = (url: string) => {
  const [liveData, setLiveData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLiveData(data);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => {
      ws.close();
    };
  }, [url]);

  return { liveData, isConnected };
};