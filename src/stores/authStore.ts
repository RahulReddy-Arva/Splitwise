import { create } from 'zustand'
import { User } from '@/types'
import { AuthService, LoginCredentials, RegisterCredentials } from '@/services/AuthService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await AuthService.signIn(credentials)
      set({
        user: response.user,
        token: response.tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      })
      throw error
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await AuthService.signUp(credentials)
      set({
        user: response.user,
        token: response.tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await AuthService.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null })
    try {
      await AuthService.resetPassword(email)
      set({ isLoading: false })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },

  initialize: () => {
    // Initialize auth state from stored data
    const user = AuthService.getStoredUser()
    const isAuthenticated = AuthService.isAuthenticated()
    
    if (user && isAuthenticated) {
      set({
        user,
        isAuthenticated: true,
        token: 'stored', // We'll get the actual token when needed
      })
    }
  },
}))