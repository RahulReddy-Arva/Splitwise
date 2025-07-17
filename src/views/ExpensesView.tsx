import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function ExpensesView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your shared expenses
          </p>
        </div>
        <Button variant="glass" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <GlassCard className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No expenses yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            Create your first expense to get started
          </p>
        </div>
      </GlassCard>
    </div>
  )
}