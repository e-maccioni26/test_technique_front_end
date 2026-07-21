import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useAlertStore, Alert } from '../store/useAlertStore';

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