import { create } from "zustand";

export const useTokenStore = create((set) => ({
  token: null,
  setToken: (token) => set({ token: token }),
  removeToken: () => set({ token: null }),
}));

export const useWsStore = create((set) => ({
  status: null,
  moisture: null,
  temperature: null,
  connected: false,
  setStatus: (status) => set({ status: status }),
  setMoisture: (moisture) => set({ moisture: moisture }),
  setTemperature: (temperature) => set({ temperature: temperature }),
  setConnected: (connected) => set({ connected: connected }),
}));

export const useLoadingStore = create((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading: loading }),
}));

export const useWeatherStore = create((set) => ({
  location: null,
  weather: null,
  setLocation: (location) => set({ location: location }),
  setWeather: (weather) => set({ weather: weather }),
}));

export const useAppStore = create((set) => ({
  sidebarOpen: true,
  windowWidth: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen: sidebarOpen }),
  setWindowWidth: (windowWidth) => set({ windowWidth: windowWidth }),
}));