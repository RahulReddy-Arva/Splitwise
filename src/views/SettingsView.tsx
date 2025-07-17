import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export function SettingsView() {
  const { logout, user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your account and preferences
        </p>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <p className="text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <p className="text-gray-900 dark:text-white">{user?.email}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions
        </h3>
        <Button variant="destructive" onClick={logout}>
          Sign Out
        </Button>
      </GlassCard>
    </div>
  )
}