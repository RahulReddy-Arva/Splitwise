import { GlassCard } from '@/components/ui/glass-card'

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black font-geist">
          Dashboard
        </h1>
        <p className="text-gray-700 mt-2 font-geist">
          Overview of your expenses and balances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-black mb-2 font-geist">
            Total Balance
          </h3>
          <p className="text-3xl font-bold text-green-600 font-geist">$0.00</p>
          <p className="text-sm text-gray-600 mt-1 font-geist">You are all settled up!</p>
        </GlassCard>

        <GlassCard variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-black mb-2 font-geist">
            Recent Expenses
          </h3>
          <p className="text-3xl font-bold text-blue-600 font-geist">0</p>
          <p className="text-sm text-gray-600 mt-1 font-geist">No recent expenses</p>
        </GlassCard>

        <GlassCard variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-black mb-2 font-geist">
            Active Groups
          </h3>
          <p className="text-3xl font-bold text-purple-600 font-geist">0</p>
          <p className="text-sm text-gray-600 mt-1 font-geist">No active groups</p>
        </GlassCard>
      </div>

      <GlassCard variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-black mb-4 font-geist">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-600 font-geist">
            No recent activity to show
          </p>
        </div>
      </GlassCard>
    </div>
  )
}