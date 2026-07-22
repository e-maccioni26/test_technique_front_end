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
const NEW_ALERT_HIGHLIGHT_MS = 1400;

interface AlertStore {
  alerts: Alert[];
  isLive: boolean;
  recentlyArrivedIds: Set<string>;
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  toggleLive: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  isLive: true,
  recentlyArrivedIds: new Set(),

  addAlert: (alert) => 
    set((state) => {
      if (!state.isLive) return state;
      if (state.alerts.some((a) => a.id === alert.id)) return state;

      setTimeout(() => {
        set((s) => {
          if (!s.recentlyArrivedIds.has(alert.id)) return s;
          const next = new Set(s.recentlyArrivedIds);
          next.delete(alert.id);
          return { recentlyArrivedIds: next };
        });
      }, NEW_ALERT_HIGHLIGHT_MS);

      const recentlyArrivedIds = new Set(state.recentlyArrivedIds);
      recentlyArrivedIds.add(alert.id);

      return { alerts: [alert, ...state.alerts], recentlyArrivedIds };
    }),
    
  updateAlertStatus: (id, status) => 
    set((state) => ({
      alerts: state.alerts.map((a) => 
        a.id === id ? { ...a, status, is_read: true } : a
      ),
    })),
    
  toggleLive: () => set((state) => ({ isLive: !state.isLive })),
}));