import { GlassCard } from '@/components/ui/glass-card'

export function BalancesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Balances
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Track who owes what
        </p>
      </div>

      <GlassCard className="p-6">
        <div className="text-center py-12">
          <p className="text-green-600 text-2xl font-semibold">
            You're all settled up!
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            No outstanding balances
          </p>
        </div>
      </GlassCard>
    </div>
  )
}