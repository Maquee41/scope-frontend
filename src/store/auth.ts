import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  access: string | null
  refresh: string | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      isAuthenticated: false,
      setTokens: (access, refresh) =>
        set({ access: access, refresh: refresh, isAuthenticated: true }),
      logout: () =>
        set({ access: null, refresh: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' },
  ),
)

export type AuthContext = ReturnType<typeof useAuthStore>
