import { User } from '@/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export class AuthService {
  private static readonly TOKEN_KEY = 'splitwise_tokens'
  private static readonly USER_KEY = 'splitwise_user'
  private static readonly DEMO_MODE = true // Set to true for demo without backend

  // Sign in with email and password
  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required')
    }

    // For demo purposes, create mock user directly
    if (this.DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Create mock user based on credentials
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        firstName: credentials.email === 'demo@splitwise.com' ? 'Demo' : 'John',
        lastName: credentials.email === 'demo@splitwise.com' ? 'User' : 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockTokens: AuthTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }

      const mockResponse: AuthResponse = {
        user: mockUser,
        tokens: mockTokens,
      }

      this.storeTokens(mockTokens)
      this.storeUser(mockUser)

      return mockResponse
    }

    // Real API call (when DEMO_MODE is false)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const authResponse: AuthResponse = await response.json()
      
      this.storeTokens(authResponse.tokens)
      this.storeUser(authResponse.user)

      return authResponse
    } catch (error) {
      throw new Error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Sign up with user details
  static async signUp(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Validate input
    if (!credentials.email || !credentials.password || !credentials.firstName || !credentials.lastName) {
      throw new Error('All fields are required')
    }

    // For demo purposes, create mock user directly
    if (this.DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockTokens: AuthTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }

      const mockResponse: AuthResponse = {
        user: mockUser,
        tokens: mockTokens,
      }

      this.storeTokens(mockTokens)
      this.storeUser(mockUser)

      return mockResponse
    }

    // Real API call (when DEMO_MODE is false)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }

      const authResponse: AuthResponse = await response.json()

      this.storeTokens(authResponse.tokens)
      this.storeUser(authResponse.user)

      return authResponse
    } catch (error) {
      throw new Error('Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Sign out and clear stored data
  static async signOut(): Promise<void> {
    if (this.DEMO_MODE) {
      // Just clear local data in demo mode
      this.clearStoredData()
      return
    }

    try {
      const tokens = this.getStoredTokens()
      if (tokens) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        })
      }
    } catch (error) {
      console.warn('Logout request failed:', error)
    } finally {
      this.clearStoredData()
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    if (!email) {
      throw new Error('Email is required')
    }

    if (this.DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Password reset requested for:', email)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Password reset failed')
      }
    } catch (error) {
      throw new Error('Password reset failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Get current access token, refreshing if necessary
  static async getValidAccessToken(): Promise<string | null> {
    const tokens = this.getStoredTokens()
    if (!tokens) return null

    // In demo mode, just return the stored token
    if (this.DEMO_MODE) {
      return tokens.accessToken
    }

    // Check if token is expired or will expire soon (within 5 minutes)
    const expirationBuffer = 5 * 60 * 1000 // 5 minutes
    const now = new Date()
    const expiresAt = new Date(tokens.expiresAt)

    if (expiresAt.getTime() - now.getTime() < expirationBuffer) {
      try {
        return await this.refreshToken()
      } catch (error) {
        console.error('Token refresh failed:', error)
        return null
      }
    }

    return tokens.accessToken
  }

  // Refresh access token
  static async refreshToken(): Promise<string> {
    const tokens = this.getStoredTokens()
    if (!tokens || !tokens.refreshToken) {
      throw new Error('No refresh token available')
    }

    if (this.DEMO_MODE) {
      // In demo mode, just return a new mock token
      const newToken = 'mock-access-token-' + Date.now()
      const newTokens: AuthTokens = {
        ...tokens,
        accessToken: newToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
      this.storeTokens(newTokens)
      return newToken
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const { accessToken, expiresAt } = await response.json()

      const newTokens: AuthTokens = {
        ...tokens,
        accessToken,
        expiresAt: new Date(expiresAt),
      }

      this.storeTokens(newTokens)
      return accessToken
    } catch (error) {
      // If refresh fails, clear stored data and require re-login
      this.clearStoredData()
      throw error
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const tokens = this.getStoredTokens()
    const user = this.getStoredUser()
    return !!(tokens && user && tokens.accessToken)
  }

  // Get stored user data
  static getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      if (userData) {
        const user = JSON.parse(userData)
        return {
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error)
    }
    return null
  }

  // Private helper methods
  private static storeTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify({
        ...tokens,
        expiresAt: tokens.expiresAt.toISOString(),
      }))
    } catch (error) {
      console.error('Error storing tokens:', error)
    }
  }

  private static storeUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('Error storing user data:', error)
    }
  }

  private static getStoredTokens(): AuthTokens | null {
    try {
      const tokenData = localStorage.getItem(this.TOKEN_KEY)
      if (tokenData) {
        const tokens = JSON.parse(tokenData)
        return {
          ...tokens,
          expiresAt: new Date(tokens.expiresAt),
        }
      }
    } catch (error) {
      console.error('Error parsing stored tokens:', error)
    }
    return null
  }

  private static clearStoredData(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
    } catch (error) {
      console.error('Error clearing stored data:', error)
    }
  }
}