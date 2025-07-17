import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function ExpensesView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black font-geist">
            Expenses
          </h1>
          <p className="text-gray-700 mt-2 font-geist">
            Manage your shared expenses
          </p>
        </div>
        <Button variant="glass" className="flex items-center gap-2 font-geist text-black">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <GlassCard variant="elevated" className="p-6">
        <div className="text-center py-12">
          <p className="text-black text-lg font-geist">
            No expenses yet
          </p>
          <p className="text-gray-600 mt-2 font-geist">
            Create your first expense to get started
          </p>
        </div>
      </GlassCard>
    </div>
  )
}