import { useEffect } from 'react';
import reactUseWebSocket from 'react-use-websocket';
import { useAlertStore, Alert } from '../store/useAlertStore';

const useWebSocket = typeof reactUseWebSocket === 'function' 
  ? reactUseWebSocket 
  : (reactUseWebSocket as any).default;

const WS_URL = 'ws://localhost:8000/ws/alerts';

export const useAlertWebSocket = () => {
  const addAlert = useAlertStore((state) => state.addAlert);
  
  const { lastJsonMessage, readyState } = useWebSocket<Alert>(WS_URL, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      addAlert(lastJsonMessage);
    }
  }, [lastJsonMessage, addAlert]);

  return { readyState };
};