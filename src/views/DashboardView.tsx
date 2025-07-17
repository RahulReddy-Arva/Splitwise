import { GlassCard } from '@/components/ui/glass-card'

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Overview of your expenses and balances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Balance
          </h3>
          <p className="text-3xl font-bold text-green-600">$0.00</p>
          <p className="text-sm text-gray-500 mt-1">You are all settled up!</p>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Recent Expenses
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">No recent expenses</p>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Active Groups
          </h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-sm text-gray-500 mt-1">No active groups</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity to show
          </p>
        </div>
      </GlassCard>
    </div>
  )
}