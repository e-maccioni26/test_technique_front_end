import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast } from 'sonner';
import { useAlertStore, Alert } from '../store/useAlertStore';

const WS_URL = 'ws://localhost:8000/ws/alerts';

type AlertMessage = { type: 'alert'; payload: Alert };
type ErrorMessage = { type: 'error'; status_code: number; message: string };
type WsMessage = AlertMessage | ErrorMessage;

export const useAlertWebSocket = () => {
  const addAlert = useAlertStore((state) => state.addAlert);

  const { lastJsonMessage, readyState } = useWebSocket<WsMessage>(WS_URL, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (!lastJsonMessage) return;

    if (lastJsonMessage.type === 'error') {
      // Échec simulé (4xx/5xx)sans polluer le flux d'alertes ni casser la connexion WebSocket.
      toast.error(`Erreur ${lastJsonMessage.status_code} — ${lastJsonMessage.message}`);
      return;
    }

    addAlert(lastJsonMessage.payload);
  }, [lastJsonMessage, addAlert]);

  return { readyState };
};