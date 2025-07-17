import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement actual authentication logic
      // For now, create a mock user
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      set({
        user: mockUser,
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true })
  },

  setToken: (token: string) => {
    set({ token })
  },
}))