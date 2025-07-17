import { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'
import { ProfileEditor } from '@/components/profile/ProfileEditor'
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Download, 
  Trash2,
  Edit3,
  Camera
} from 'lucide-react'

export function SettingsView() {
  const { logout, user, updateProfile } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'data'>('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    expenseUpdates: true,
    paymentReminders: true,
    groupInvitations: true,
    emailNotifications: true,
  })

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
    { id: 'data' as const, label: 'Data', icon: Download },
  ]

  const handleProfileSave = (updatedUser: any) => {
    setIsEditingProfile(false)
    // Profile is already updated by the ProfileEditor component
  }

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleExportData = () => {
    // In a real app, this would trigger a data export
    alert('Data export feature will be implemented in a future update')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would delete the account
      alert('Account deletion feature will be implemented in a future update')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black font-geist">
          Settings
        </h1>
        <p className="text-gray-700 mt-2 font-geist">
          Manage your account and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <GlassCard className="p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-geist ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-black'
                    : 'text-gray-700 hover:text-black hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {isEditingProfile ? (
            <ProfileEditor
              onSave={handleProfileSave}
              onCancel={() => setIsEditingProfile(false)}
            />
          ) : (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black font-geist">
                  Profile Information
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1 font-geist">
                        First Name
                      </label>
                      <p className="text-black font-medium font-geist">
                        {user?.firstName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1 font-geist">
                        Last Name
                      </label>
                      <p className="text-black font-medium font-geist">
                        {user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1 font-geist">
                      Email Address
                    </label>
                    <p className="text-black font-medium font-geist">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1 font-geist">
                      Member Since
                    </label>
                    <p className="text-gray-600 font-geist">
                      {user?.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-black mb-6 font-geist">
            Notification Preferences
          </h3>
          
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-black font-geist">
                    {key === 'expenseUpdates' && 'Expense Updates'}
                    {key === 'paymentReminders' && 'Payment Reminders'}
                    {key === 'groupInvitations' && 'Group Invitations'}
                    {key === 'emailNotifications' && 'Email Notifications'}
                  </label>
                  <p className="text-xs text-gray-600 font-geist">
                    {key === 'expenseUpdates' && 'Get notified when expenses are added or modified'}
                    {key === 'paymentReminders' && 'Receive reminders for outstanding payments'}
                    {key === 'groupInvitations' && 'Get notified when invited to groups'}
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key as keyof typeof notificationSettings)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-black mb-6 font-geist">
            Privacy & Security
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-black mb-3 font-geist">
                Password
              </h4>
              <Button variant="outline">
                Change Password
              </Button>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-black mb-3 font-geist">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-600 mb-3 font-geist">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">
                Enable 2FA
              </Button>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-black mb-3 font-geist">
                Active Sessions
              </h4>
              <p className="text-sm text-gray-600 mb-3 font-geist">
                Manage devices that are signed into your account
              </p>
              <Button variant="outline">
                View Sessions
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-black mb-6 font-geist">
              Data Management
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-black mb-3 font-geist">
                  Export Data
                </h4>
                <p className="text-sm text-gray-600 mb-3 font-geist">
                  Download a copy of your data including expenses, groups, and payments
                </p>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-black mb-3 font-geist">
                  Data Retention
                </h4>
                <p className="text-sm text-gray-600 mb-3 font-geist">
                  Control how long your data is stored
                </p>
                <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-black font-geist">
                  <option>Keep data indefinitely</option>
                  <option>Delete after 1 year</option>
                  <option>Delete after 2 years</option>
                  <option>Delete after 5 years</option>
                </select>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-6">
              Danger Zone
            </h3>
            
            <div>
              <h4 className="text-md font-medium text-black mb-3 font-geist">
                Delete Account
              </h4>
              <p className="text-sm text-gray-600 mb-4 font-geist">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Sign Out Section */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black font-geist">
              Sign Out
            </h3>
            <p className="text-sm text-gray-600 font-geist">
              Sign out of your account on this device
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}