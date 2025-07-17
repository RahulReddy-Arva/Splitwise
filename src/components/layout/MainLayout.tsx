import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Receipt, 
  Users, 
  Scale, 
  Settings,
  Menu
} from 'lucide-react'
import { useState } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Balances', href: '/balances', icon: Scale },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:inset-0"
      )}>
        <div className="flex flex-col h-full glass-card rounded-none lg:rounded-r-xl">
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <h1 className="text-xl font-bold text-white">Splitwise</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="flex items-center justify-between h-16 px-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Splitwise
          </h1>
        </div>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}