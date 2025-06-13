import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  access: string | null
  refresh: string | null
  isAuthenticated: boolean
  hydrated: boolean
  setTokens: (access: string, refresh: string) => void
  logout: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      isAuthenticated: false,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setTokens: (access, refresh) =>
        set({ access, refresh, isAuthenticated: true }),
      logout: () =>
        set({ access: null, refresh: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => () => {
        useAuthStore.getState().setHydrated()
      },
    },
  ),
)
