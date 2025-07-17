import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function GroupsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Groups
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Organize expenses by groups
          </p>
        </div>
        <Button variant="glass" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      <GlassCard className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No groups yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            Create your first group to organize expenses
          </p>
        </div>
      </GlassCard>
    </div>
  )
}