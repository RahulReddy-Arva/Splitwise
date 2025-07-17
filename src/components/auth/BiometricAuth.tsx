import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Fingerprint, Eye } from 'lucide-react'

interface BiometricAuthProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export function BiometricAuth({ onSuccess, onError }: BiometricAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleBiometricAuth = async (type: 'fingerprint' | 'face') => {
    setIsAuthenticating(true)
    
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would use WebAuthn API or native biometric APIs
      // For demo, we'll simulate success most of the time
      const success = Math.random() > 0.2 // 80% success rate
      
      if (success) {
        onSuccess()
      } else {
        onError(`${type === 'fingerprint' ? 'Fingerprint' : 'Face ID'} authentication failed`)
      }
    } catch (error) {
      onError('Biometric authentication not available')
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Or use biometric authentication
        </p>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleBiometricAuth('fingerprint')}
          disabled={isAuthenticating}
          className="flex flex-col items-center gap-2 h-20 w-20 p-2"
        >
          <Fingerprint className="h-6 w-6" />
          <span className="text-xs">Touch ID</span>
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleBiometricAuth('face')}
          disabled={isAuthenticating}
          className="flex flex-col items-center gap-2 h-20 w-20 p-2"
        >
          <Eye className="h-6 w-6" />
          <span className="text-xs">Face ID</span>
        </Button>
      </div>
      
      {isAuthenticating && (
        <div className="text-center">
          <p className="text-sm text-blue-600 animate-pulse">
            Authenticating...
          </p>
        </div>
      )}
    </div>
  )
}