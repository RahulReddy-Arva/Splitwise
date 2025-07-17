import { GlassCard } from '@/components/ui/glass-card'

export function BalancesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black font-geist">
          Balances
        </h1>
        <p className="text-gray-700 mt-2 font-geist">
          Track who owes what
        </p>
      </div>

      <GlassCard variant="elevated" className="p-6">
        <div className="text-center py-12">
          <p className="text-green-600 text-2xl font-semibold font-geist">
            You're all settled up!
          </p>
          <p className="text-gray-600 mt-2 font-geist">
            No outstanding balances
          </p>
        </div>
      </GlassCard>
    </div>
  )
}