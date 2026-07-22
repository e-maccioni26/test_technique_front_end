import { create } from 'zustand';

export interface Alert {
  id: string;
  ip: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threat_type: string;
  status: 'active' | 'banned' | 'ignored';
  is_read: boolean;
}

interface AlertStore {
  alerts: Alert[];
  isLive: boolean; 
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  toggleLive: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  isLive: true,
  
  addAlert: (alert) => 
    set((state) => {
      if (!state.isLive) return state;
      return { alerts: [alert, ...state.alerts] };
    }),
    
  updateAlertStatus: (id, status) => 
    set((state) => ({
      alerts: state.alerts.map((a) => 
        a.id === id ? { ...a, status, is_read: true } : a
      ),
    })),
    
  toggleLive: () => set((state) => ({ isLive: !state.isLive })),
}));