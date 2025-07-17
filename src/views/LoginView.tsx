import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { BiometricAuth } from '@/components/auth/BiometricAuth'
import { ValidationUtils } from '@/lib/validation'
import { Eye, EyeOff } from 'lucide-react'

export function LoginView() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  
  const { login, register, resetPassword, isLoading, error, clearError } = useAuthStore()

  const validateForm = () => {
    const errors: string[] = []
    
    // Email validation
    const emailErrors = ValidationUtils.validateEmail(email)
    errors.push(...emailErrors.map(e => e.message))
    
    // Password validation
    if (!password) {
      errors.push('Password is required')
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters')
    }
    
    // Sign up specific validation
    if (isSignUp) {
      if (!firstName.trim()) errors.push('First name is required')
      if (!lastName.trim()) errors.push('Last name is required')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationErrors([])
    
    if (!validateForm()) {
      return
    }
    
    try {
      if (isSignUp) {
        await register({ email, password, firstName, lastName })
      } else {
        await login({ email, password })
      }
    } catch (error) {
      // Error is handled by the store
      console.error('Authentication failed:', error)
    }
  }

  const handleBiometricSuccess = async () => {
    // In a real app, this would get stored credentials or use a stored session
    // For demo, we'll use a default demo account
    try {
      await login({ email: 'demo@splitwise.com', password: 'biometric-auth' })
    } catch (error) {
      console.error('Biometric login failed:', error)
    }
  }

  const handleBiometricError = (error: string) => {
    setValidationErrors([error])
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      await resetPassword(email)
      setShowResetPassword(false)
      // Show success message (you could add a toast here)
      alert('Password reset email sent!')
    } catch (error) {
      console.error('Password reset failed:', error)
    }
  }

  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black font-geist">
              Reset Password
            </h1>
            <p className="text-gray-700 mt-2 font-geist">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2 font-geist">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowResetPassword(false)}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to Sign In
            </button>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black font-geist">
            Splitwise
          </h1>
          <p className="text-gray-700 mt-2 font-geist">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2 font-geist">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2 font-geist">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2 font-geist">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2 font-geist">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {(error || validationErrors.length > 0) && (
            <div className="text-red-600 text-sm text-center space-y-1">
              {error && <div>{error}</div>}
              {validationErrors.map((err, index) => (
                <div key={index}>{err}</div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading 
              ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
              : (isSignUp ? 'Create Account' : 'Sign In')
            }
          </Button>
        </form>

        {!isSignUp && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-6">
              <BiometricAuth 
                onSuccess={handleBiometricSuccess}
                onError={handleBiometricError}
              />
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {!isSignUp && (
            <div className="text-center">
              <button 
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-700 font-geist">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  clearError()
                }}
                className="text-blue-600 hover:text-blue-500 font-medium font-geist"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}