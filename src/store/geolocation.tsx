// geolocationStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GeolocationState {
  latitude: number;
  longitude: number;
  updatedAt: number;
  setGeolocation: (latitude: number, longitude: number) => void;
}

export const useGeolocationStore = create<GeolocationState>()(
  persist(
    (set) => ({
      latitude: 0, // Default value
      longitude: 0, // Default value
      updatedAt: Date.now(),
      setGeolocation: (latitude, longitude) =>
        set(() => ({
          latitude,
          longitude,
          updatedAt: Date.now(),
        })),
    }),
    {
      name: 'geolocation-storage', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);