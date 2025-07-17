import { useState, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { ValidationUtils } from '@/lib/validation'
import { Camera, Upload, X } from 'lucide-react'
import { User } from '@/types'

interface ProfileEditorProps {
  onSave?: (user: User) => void
  onCancel?: () => void
}

export function ProfileEditor({ onSave, onCancel }: ProfileEditorProps) {
  const { user, setUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const validateForm = () => {
    const validationErrors: string[] = []
    
    // Email validation
    const emailErrors = ValidationUtils.validateEmail(formData.email)
    validationErrors.push(...emailErrors.map(e => e.message))
    
    // Name validation
    if (!formData.firstName.trim()) {
      validationErrors.push('First name is required')
    }
    if (!formData.lastName.trim()) {
      validationErrors.push('Last name is required')
    }
    
    setErrors(validationErrors)
    return validationErrors.length === 0
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(['Please select a valid image file'])
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(['Image size must be less than 5MB'])
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setPreviewImage(imageUrl)
        setFormData(prev => ({ ...prev, profilePicture: imageUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setFormData(prev => ({ ...prev, profilePicture: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      const updatedUser: User = {
        ...user!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profilePicture: formData.profilePicture || undefined,
        updatedAt: new Date(),
      }
      
      // Update auth store
      setUser(updatedUser)
      
      // Call callback if provided
      onSave?.(updatedUser)
      
    } catch (error) {
      setErrors(['Failed to update profile. Please try again.'])
    } finally {
      setIsLoading(false)
    }
  }

  const currentImage = previewImage || formData.profilePicture

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Edit Profile
        </h2>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {currentImage ? (
              <div className="relative">
                <img
                  src={currentImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="text-red-600 text-sm space-y-1">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </GlassCard>
  )
}